'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

// Schema de validação com Zod
const FormSchema = z.object({
  description: z.string().min(1, 'Campo obrigatório').max(60, 'A descrição deve ter no máximo 60 caracteres'),
  value: z
    .number()
    .nonnegative('O valor deve ser maior ou igual a 0')
    .max(9999999999999, 'O valor informado ultrapassou o saldo máximo permitido'),
  paymentType: z.enum(['Cash', 'Installment']).nullable().optional(),
  installmentsNumber: z
    .number()
    .int()
    .nullable()
    .optional()
    .refine((n) => n >= 0, 'O número de parcelas deve ser maior ou igual a 0'),
  personId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  isPaid: z.boolean().optional(),
});

function BillToPayForm() {
  // Recupera parâmetros de rota e define estados necessários
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [billValue, setBillValue] = useState('');
  const [installmentsNumberValue, setInstallmentsNumberValue] = useState('');
  const [persons, setPersons] = useState([]);

  // Configuração do formulário com validação Zod
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      value: 0,
      personId: null,
      isPaid: false,
      dueDate: null,
      paymentType: null,
      installmentsNumber: null,
    },
  });

  // Função para buscar a lista de pessoas
  const fetchPersons = async () => {
    try {
      const response = await fetch('/api/person');
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    }
  };

  // Função para buscar os dados da conta a pagar por ID (edição)
  const fetchBillToPayData = async () => {
    try {
      const response = await fetch(`/api/finance/billToPay/?id=${id}`);
      const data = await response.json();
      setBillValue(data.value?.toString() || '');
      setInstallmentsNumberValue(data.installmentsNumber?.toString() || '');
      form.reset({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : null,
        personId: data.personId || null,
      });
    } catch (error) {
      console.error('Erro ao buscar dados da conta a pagar:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
    if (id) {
      fetchBillToPayData();
    } else {
      setIsDataLoading(false);
    }
  }, [id]);

  // Função de envio do formulário
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsFormSubmitting(true);
    const url = id ? `/api/finance/billToPay/?id=${id}` : '/api/finance/billToPay';
    const method = id ? 'PUT' : 'POST';

    // Garante valores padrão para campos opcionais
    const payload = {
      ...values,
      personId: values.personId || null, // Se vazio, envia null
      dueDate: values.dueDate || null, // Se vazio, envia null
      paymentType: values.paymentType || null, // Se vazio, envia null
      installmentsNumber: values.installmentsNumber || null, // Se vazio, envia null
    };

    try {
      const response = await fetch(url, {
        method,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ description: data.message });
        router.push('/finance/billToPay');
      } else {
        toast({ description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ description: 'Erro ao enviar formulário.', variant: 'destructive' });
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

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
                  <Input placeholder={!isDataLoading ? 'Descrição da conta' : 'Carregando...'} {...field} />
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
                      <SelectValue placeholder={!isDataLoading ? 'Selecione a pessoa a ser paga' : 'Carregando...'} />
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
                        maxLength={2}
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

          {/* Botão de submissão */}
          <Button className="w-full mt-6" type="submit" disabled={isFormSubmitting}>
            {isFormSubmitting ? 'Salvando...' : id ? 'Salvar' : 'Cadastrar'}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default BillToPayForm;
