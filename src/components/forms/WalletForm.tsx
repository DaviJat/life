'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/use-toast';

interface WalletFormProps {
  id?: string;
}

// Define o esquema de validação para o formulário
const FormSchema = z.object({
  description: z.string().min(1, 'Campo obrigatório').max(30, 'A descrição deve ter no máximo 30 caracteres'),
  balance: z.string().transform((val) => parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'))),
  type: z.enum(['Physical', 'Virtual'], {
    required_error: 'Campo obrigatório',
  }),
});

function WalletForm({ id }: WalletFormProps) {
  // Estado para controlar o carregamento e evitar multiplos submits do formulário
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  // Estado para controlar o carregamento dos dados da página
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // Configuração do formulário utilizando useForm do react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      balance: '' as unknown as number,
      type: undefined,
    },
  });

  const router = useRouter(); // Hook useRouter para obter o objeto router do Next.js

  // Efeito para carregar os dados por ID quando o ID é fornecido
  useEffect(() => {
    if (id) {
      setIsDataLoading(true);
      getDataById();
    } else {
      setIsDataLoading(false);
    }
  }, [form, id]);

  // Função para obter os dados por ID
  const getDataById = async () => {
    const response = await fetch(`/api/finance/wallet/?id=${id}`);
    const data = await response.json();
    setIsDataLoading(false);
    form.reset(data);
  };

  // Função de submissão do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true);
    const url = id ? `/api/finance/wallet/?id=${id}` : '/api/finance/wallet';
    const method = id ? 'PUT' : 'POST';

    // Requisição para enviar os dados do formulário
    const response = await fetch(url, {
      method,
      cache: 'no-store',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: values.description,
        balance: values.balance,
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
      router.push('/finance/wallet'); // Redireciona para a listagem
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
          {/* Descrição da carteira */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder={!isDataLoading ? 'Descrição do local' : 'Carregando...'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Saldo da carteira */}
          <FormField
            name="balance"
            render={({ field: { value, ref, ...rest } }) => (
              <FormItem>
                <FormLabel>Saldo</FormLabel>
                <FormControl>
                  <NumericFormat
                    decimalScale={2}
                    customInput={Input}
                    decimalSeparator=","
                    thousandSeparator="."
                    fixedDecimalScale
                    prefix={'R$ '}
                    getInputRef={ref}
                    placeholder={!isDataLoading ? 'Saldo da carteira...' : 'Carregando...'}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tipo de carteira */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de carteira</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={!isDataLoading ? 'Selecione o tipo de carteira' : 'Carregando...'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="Physical">Física</SelectItem>
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

export default WalletForm;
