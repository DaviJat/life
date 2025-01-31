'use client';

// Importações de dependências externas
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Componentes e utilitários da UI
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import DatePicker from '../ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import IntegerInput from '../ui/integer-input';
import MoneyInput from '../ui/money-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from '../ui/use-toast';

// Schema de validação utilizando Zod
const FormSchema = z.object({
  description: z
    .string({ required_error: 'A descrição é obrigatória.' })
    .max(60, 'A descrição deve ter no máximo 60 caracteres.'), // Descrição da conta
  value: z.number().max(9999999.99, 'Valor máximo de 9.999.999,99').optional(), // Valor máximo de 9.999.999,99
  personId: z.string().max(5).optional(), // Identificação da pessoa
  paymentType: z.enum(['Cash', 'Installment']).optional(), // Tipo de pagamento
  dueDate: z.date({ invalid_type_error: 'O valor deve ser uma data válida.' }).optional(), // Data de vencimento
  installmentsNumber: z.number().int().max(99, 'O número máximo de parcelas é 99.').optional(), // Número máximo de 99 parcelas
  isPaid: z.boolean().optional(), // Status de pagamento
});

function BillToPayForm() {
  // Recupera parâmetros de rota e navegação
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Estados locais
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [billValue, setBillValue] = useState('');
  const [installmentsNumberValue, setInstallmentsNumberValue] = useState('');
  const [persons, setPersons] = useState([]);

  // Configuração do formulário com validação baseada em Zod
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Função para recuperar persons para popular o select
  const getPersons = async () => {
    const response = await fetch(`/api/person`);
    const data = await response.json();
    setPersons(data);
  };

  // Função para recuperar os dados para a edição do objeto
  const getDataById = async () => {
    const response = await fetch(`/api/finance/billToPay/?id=${id}`);
    const data = await response.json();
    setBillValue(data.value.toString());
    setInstallmentsNumberValue(data.installmentsNumber?.toString() || '');
    setIsDataLoading(false); // Desativa o estado de carregamento de dados
    form.reset(data); // Atualiza os dados com do formulário com os dados recuperados
  };

  useEffect(() => {
    // Recupera os persons da API
    getPersons();
    if (id) {
      // Se estiver na edição recupera os dados do objeto da API
      getDataById();
    } else {
      // Se estiver no cadastro desativa o estado de carregamento de dados
      setIsDataLoading(false);
    }
  }, [form, id]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true); // Ativa o estado de envio de formulário

    // Configurações para o fetch API, com base no tipo de formuário
    const url = id ? `/api/finance/billToPay/?id=${id}` : '/api/finance/billToPay';
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
        value: values.value || null,
        personId: values.personId || null,
        paymentType: values.paymentType || null,
        dueDate: values.dueDate || null,
        installmentsNumber: values.installmentsNumber || null,
        isPaid: values.isPaid || null,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Se a resposta for bem-sucedida, redireciona para a listagem e mostra mensagem de sucesso
      toast({
        description: data.message,
      });
      router.push('/finance/billToPay');
    } else {
      // Se a resposta não for bem-sucedida, mostra mensagem de erro
      toast({
        description: data.message,
        variant: 'destructive',
      });
    }
  };

  // Retorna o componente
  return (
    <>
      <h1 className="font-semibold text-2xl">{id ? 'Editar conta a pagar' : 'Cadastrar conta a pagar'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Campo: Descrição */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    maxLength={60}
                    placeholder={!isDataLoading ? 'Descrição da conta' : 'Carregando...'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo: Valor */}
          <MoneyInput
            form={form}
            value={billValue}
            label="Valor"
            maxLength={9}
            name="value"
            placeholder={!isDataLoading ? 'Valor da conta' : 'Carregando...'}
          />
          {/* Campo: Pessoa */}
          <FormField
            control={form.control}
            name="personId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pessoa a ser paga</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={!isDataLoading ? 'Selecione a pessoa' : 'Carregando...'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {persons.map((person) => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo: Tipo de pagamento e Vencimento */}
          <FormField
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do pagamento</FormLabel>
                <FormControl>
                  <Tabs defaultValue="Cash" onValueChange={form.setValue.bind(null, 'paymentType')}>
                    <TabsList className="flex w-full max-w-96">
                      <TabsTrigger value="Cash" className="w-full">
                        À vista
                      </TabsTrigger>
                      <TabsTrigger value="Installment" className="w-full">
                        Parcelado
                      </TabsTrigger>
                    </TabsList>

                    <FormField
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch('paymentType') === 'Installment'
                              ? 'Data de vencimento (Primeira parcela)'
                              : 'Data de vencimento'}
                          </FormLabel>
                          <FormControl>
                            <DatePicker field={field} placeholder={!isDataLoading ? 'dd/mm/aaaa' : 'Carregando...'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TabsContent value="Installment">
                      {/* Campo: Número de parcelas */}
                      <IntegerInput
                        form={form}
                        name="installmentsNumber"
                        label="Quantidade de parcelas"
                        placeholder={!isDataLoading ? 'Número de parcelas da conta' : 'Carregando...'}
                        value={installmentsNumberValue}
                        maxLength={3}
                      />
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo: Pago */}
          <FormField
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 mt-4">
                <FormControl>
                  <Checkbox id="isPaid" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel htmlFor="isPaid">Pago</FormLabel>
              </FormItem>
            )}
          />
          {/* Botão de envio */}
          <Button className="w-full mt-6" type="submit" disabled={isFormSubmitting}>
            {id ? (isFormSubmitting ? 'Salvando...' : 'Salvar') : 'Cadastrar'}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default BillToPayForm;
