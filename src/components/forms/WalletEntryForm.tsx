'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import MoneyInput from '../ui/money-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/use-toast';

// Esquema para validação de formulário usando zod
const FormSchema = z.object({
  description: z.string().min(1, 'Campo obrigatório').max(60, 'A descrição deve ter no máximo 60 caracteres'),
  amount: z.coerce
    .number()
    .min(0.01, 'Campo obrigatório')
    .max(9999999999999, 'O valor informado ultrapassou o saldo máximo possível'),
  walletId: z.string().min(1, { message: 'Campo obrigatório' }),
});

// Componente para formulário de cadastro e edição de objetos
function WalletEntryForm() {
  // Recupera o id do objeto e utilizada para identificar o tipo de formulário
  const id = useParams<{ id: string }>().id;
  // Estado para controlar o carregamento e evitar multiplos submits do formulário
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  // Estado para controlar mensagens de carregamento dos dados da página
  const [isDataLoading, setIsDataLoading] = useState(true);
  // Estado para passar o value do amount no componente MoneyInput
  const [amountValue, setAmountValue] = useState('');
  // Estado para armazenar as wallets recuperadas pelo getWallet
  const [wallets, setWallets] = useState([]);

  const router = useRouter();

  // Utilizando hook useForm com o esquema de validação do zod, e atribuindo valores default para os inputs
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      walletId: '',
    },
  });

  // Função para recuperar wallets para popular o select
  const getWallets = async () => {
    const response = await fetch(`/api/finance/wallet`);
    const data = await response.json();
    setWallets(data);
  };

  // Função para recuperar os dados para a edição do objeto
  const getDataById = async () => {
    const response = await fetch(`/api/finance/walletEntry/?id=${id}`);
    const data = await response.json();
    setAmountValue(data.amount.toString());
    setIsDataLoading(false); // Desativa o estado de carregamento de dados
    form.reset(data); // Atualiza os dados com do formulário com os dados recuperados
  };

  useEffect(() => {
    // Recupera os wallets da API
    getWallets();
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
    const url = id ? `/api/finance/walletEntry/?id=${id}` : '/api/finance/walletEntry';
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
        amount: values.amount,
        walletId: Number(values.walletId),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Se a resposta for bem-sucedida, redireciona para a listagem e mostra mensagem de sucesso
      toast({
        description: data.message,
      });
      router.push('/finance/walletEntry');
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
      <h1 className="font-semibold text-2xl">{id ? 'Editar entrada' : 'Cadastrar entrada'} </h1>
      {/* Componente de formulário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Descrição da entrada */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder={!isDataLoading ? 'Descrição da entrada' : 'Carregando...'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Valor da entrada */}
          <MoneyInput
            form={form}
            value={amountValue}
            label="Valor"
            name="amount"
            placeholder={!isDataLoading ? 'Valor da entrada...' : 'Carregando...'}
          />
          {/* Carteira */}
          <FormField
            control={form.control}
            name="walletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carteira</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={!isDataLoading ? 'Selecione a carteira' : 'Carregando...'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id.toString()}>
                        {wallet.description}
                      </SelectItem>
                    ))}
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

export default WalletEntryForm;
