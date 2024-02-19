'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

const FormSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInData?.error) {
      if (signInData.error === 'CredentialsSignin') {
        toast({
          description: 'Email ou senha incorretos. Por favor, tente novamente.',
          variant: 'destructive',
        });
      } else {
        toast({
          description: 'Ops! Houve um problema durante o login. Por favor, tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    } else {
      router.refresh();
      router.push('/home');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
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
        </div>
        <Button className="bg-primary w-full mt-6" type="submit">
          Entrar
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
