'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

// Define o esquema de validação do formulário usando Zod
const FormSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const SignInForm = () => {
  const router = useRouter(); // Hook useRouter para obter o objeto router do Next.js
  const { toast } = useToast(); // Hook personalizado para exibir toasts
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o carregamento do formulário

  // Hook useForm para gerenciar o estado do formulário
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // Usa o resolvedor Zod para validação do esquema
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true); // Define isLoading como true para indicar carregamento

    // Envia uma solicitação de login (função do NextAuth) com os dados do formulário
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      // Se ocorrer um erro durante o login
      if (signInData.error === 'CredentialsSignin') {
        // Se o erro for de credenciais inválidas
        toast({
          // Exibe um toast de erro de credenciais inválidas
          description: 'Email ou senha incorretos. Por favor, tente novamente.',
          variant: 'destructive',
        });
      } else {
        // Se o erro for diferente de credenciais inválidas
        toast({
          // Exibe um toast de erro genérico
          description: 'Ops! Houve um problema durante o login. Por favor, tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    } else {
      // Se o login for bem-sucedido
      router.refresh(); // Atualiza a rota
      router.push('/home'); // Redireciona para a página inicial
    }
    setIsLoading(false); // Define isLoading como false após o término da requisição

    // Observação: Aqui as mensagens são setadas diretamente, pois é utilizada a função de autenticação do próprio Next.
    // Em outros formulários mensagens personalizadas são retornadas pela API.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
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
        </div>
        {/* Botão de envio do formulário */}
        <Button className="bg-primary w-full mt-6" type="submit" disabled={isLoading}>
          {isLoading ? 'Validando login...' : 'Entrar'}
        </Button>
      </form>
      <div className="text-white mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-white after:ml-4 after:block after:h-px after:flex-grow after:bg-white">
        ou
      </div>
      <p className="text-center text-sm text-white mt-2">
        Se ainda não tiver uma conta, por favor,&nbsp;
        <Link className="text-primary hover:underline" href="/sign-up">
          Cadastre-se
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
