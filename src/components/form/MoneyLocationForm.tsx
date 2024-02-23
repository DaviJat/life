'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/use-toast';

interface MoneyLocationFormProps {
  id?: string;
}

// Define o esquema de validação para o formulário
const FormSchema = z.object({
  description: z.string().min(1, 'Campo obrigatório').max(30, 'A descrição deve ter no máximo 30 caracteres'),
  type: z.enum(['Physical', 'Virtual'], {
    required_error: 'Campo obrigatório',
  }),
});

function MoneyLocationForm({ id }: MoneyLocationFormProps) {
  // Estado para controlar o carregamento e evitar multiplos submits do formulário
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  // Estado para controlar o carregamento dos dados da página
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // Configuração do formulário utilizando useForm do react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      type: undefined,
    },
  });

  const router = useRouter(); // Hook useRouter para obter o objeto router do Next.js

  // Efeito para carregar os dados por ID quando o ID é fornecido
  useEffect(() => {
    if (id) {
      setIsDataLoading(true);
      getDataById();
    }
  }, [form, id]);

  // Função para obter os dados por ID
  const getDataById = async () => {
    try {
      const response = await fetch(`/api/finance/money-location/?id=${id}`);
      const data = await response.json();
      setIsDataLoading(false);
      form.reset(data);
    } catch (error) {
      console.error('Erro ao obter dados por ID:', error);
    }
  };

  // Função de submissão do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true);
    const url = id ? `/api/finance/money-location/?id=${id}` : '/api/finance/money-location';
    const method = id ? 'PUT' : 'POST';

    // Requisição para enviar os dados do formulário
    const response = await fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: values.description,
        type: values.type,
      }),
    });

    const data = await response.json(); // Extrai os dados da resposta

    if (response.ok) {
      // Se a resposta for bem-sucedida
      toast({
        // Exibe um toast de sucesso
        description: data.message,
      });
      router.push('/finance/money-location'); // Redireciona para a listagem
    } else {
      // Se a resposta não for bem-sucedida
      toast({
        // Exibe um toast de erro
        description: data.message,
        variant: 'destructive',
      });
    }
    setIsFormSubmitting(false); // Define isFormSubmitting como false após o término da requisição
  };

  return (
    <>
      {/* Componente de formulário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Descrição do local dinheiro */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Descrição</FormLabel>
                <FormControl>
                  <Input placeholder={isDataLoading ? 'Carregando dados...' : 'Descrição do local'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tipo do dinheiro */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do dinheiro</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isDataLoading ? 'Carregando dados...' : 'Selecione o tipo do dinheiro'}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="Physical">Físico</SelectItem>
                  </SelectContent>
                </Select>
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

export default MoneyLocationForm;
