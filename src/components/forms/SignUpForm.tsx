'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

// Define o esquema de validação do formulário usando Zod
const FormSchema = z
  .object({
    username: z
      .string()
      .min(1, 'O nome de usuário é obrigatório')
      .max(30, 'O nome de usuário deve ter no máximo 30 caracteres'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(1, 'A senha é obrigatória').min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confime sua senha').min(8, 'A senha deve ter pelo menos 8 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

// Componente do formulário de cadastro
const SignUpForm = () => {
  // Estado para controlar o carregamento e evitar multiplos submits do formulário
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    // Hook useForm para gerenciar o estado do formulário
    resolver: zodResolver(FormSchema), // Usa o resolvedor Zod para validação do esquema
    defaultValues: {
      // Valores padrão do formulário
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter(); // Hook useRouter para obter o objeto router do Next.js

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true);

    // Envia uma requisição POST para '/api/user' com os dados do formulário
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });

    console.log(response);

    const data = await response.json(); // Extrai os dados da resposta

    if (response.ok) {
      // Se a resposta for bem-sucedida
      toast({
        // Exibe um toast de sucesso
        description: data.message,
      });
      router.push('/sign-in'); // Redireciona para a página de login
    } else {
      // Se a resposta não for bem-sucedida
      toast({
        // Exibe um toast de erro
        description: data.message,
        variant: 'destructive',
      });
    }
    setIsFormSubmitting(false);
  };

  return (
    <Form {...form}>
      {' '}
      {/* Componente de formulário com props do hook-form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          {/* Nome de usuário */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Nome de usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome de usuário" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu e-mail" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirmação de senha */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirme sua senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite novamente sua senha" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Botão de envio do formulário */}
        <Button className="w-full mt-6" type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
      <div className="text-white mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-white after:ml-4 after:block after:h-px after:flex-grow after:bg-white">
        ou
      </div>
      {/* Link para página de login */}
      <p className="text-center text-sm text-white mt-2">
        Já possui uma conta?&nbsp;
        <Link className="text-primary hover:underline" href="/sign-in">
          Faça login
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
