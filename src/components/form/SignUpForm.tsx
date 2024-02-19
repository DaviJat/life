'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

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

const SignUpForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
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

    const data = await response.json();

    if (response.ok) {
      toast({
        description: data.message,
      });
      router.push('/sign-in');
    } else {
      toast({
        description: data.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
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
        <Button className="w-full mt-6" type="submit">
          Cadastrar
        </Button>
      </form>
      <div className="text-white mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-white after:ml-4 after:block after:h-px after:flex-grow after:bg-white">
        ou
      </div>
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
