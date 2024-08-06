'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

// Esquema para validação de formulário usando zod
const FormSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório').max(30, 'O nome deve ter no máximo 30 caracteres'),
  phone: z.string().min(1, 'Campo obrigatório').max(30, 'O número deve ter no máximo 30 caracteres'),
});

// Componente para formulário de cadastro e edição de objetos
function WalletForm() {
  // Recupera o id do objeto e utilizada para identificar o tipo de formulário
  const id = useParams<{ id: string }>().id;
  // Estado para controlar o carregamento e evitar multiplos submits do formulário
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  // Estado para controlar mensagens de carregamento dos dados da página
  const [isDataLoading, setIsDataLoading] = useState(true);

  const router = useRouter();

  // Utilizando hook useForm com o esquema de validação do zod, e atribuindo valores default para os inputs
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  // Função para recuperar os dados para a edição do objeto
  const getDataById = async () => {
    const response = await fetch(`/api/person/?id=${id}`);
    const data = await response.json();
    setIsDataLoading(false); // Desativa o estado de carregamento de dados
    form.reset(data); // Atualiza os dados com do formulário com os dados recuperados
  };

  useEffect(() => {
    if (id) {
      // Se estiver na edição recupera os dados do objeto da API
      getDataById();
    } else {
      // Se estiver no cadastro desativa o estado de carregamento de dados
      setIsDataLoading(false);
    }
  }, [form, id]);

  // Função de submissão do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true); // Ativa o estado de envio de formulário

    // Configurações para o fetch API, com base no tipo de formuário
    const url = id ? `/api/person/?id=${id}` : '/api/person';
    const method = id ? 'PUT' : 'POST';

    // Requisição para enviar os dados do formulário
    const response = await fetch(url, {
      method,
      cache: 'no-store',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Se a resposta for bem-sucedida, redireciona para a listagem e mostra mensagem de sucesso
      toast({
        description: data.message,
      });
      router.push('/person');
    } else {
      // Se a resposta não for bem-sucedida, mostra mensagem de erro
      toast({
        description: data.message,
        variant: 'destructive',
      });
    }
    setIsFormSubmitting(false); // Define isFormSubmitting como false após o término da requisição
  };

  return (
    <>
      <h1 className="font-semibold text-2xl">{id ? 'Editar pessoa' : 'Cadastrar pessoa'} </h1>
      {/* Componente de formulário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Nome da pessoa */}
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder={!isDataLoading ? 'Nome da pessoa' : 'Carregando...'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Número da pessoa */}
          <FormField
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder={!isDataLoading ? 'Número da pessoa' : 'Carregando...'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Botão de envio do formulário */}
          <Button className="w-full mt-6" type="submit" disabled={isFormSubmitting}>
            {id ? (isFormSubmitting ? 'Salvando...' : 'Salvar') : 'Cadastrar'}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default WalletForm;
