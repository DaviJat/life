'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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

const FormSchema = z.object({
  description: z.string().max(20),
  type: z.enum(['Physical', 'Virtual']),
});

function MoneyLocationForm({ id }: MoneyLocationFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      type: undefined,
    },
  });

  useEffect(() => {
    if (id) {
      getDataById();
    }
  }, [form, id]);

  const getDataById = async () => {
    try {
      const response = await fetch(`/api/finance/money-location/?id=${id}`);
      const data = await response.json();
      form.reset(data);
    } catch (error) {
      console.error('Erro ao obter dados por ID:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (id) {
      const response = await fetch(`/api/finance/money-location/?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          description: values.description,
          type: values.type,
        }),
      });

      if (response.ok) {
        toast({
          description: 'Localização dinheiro editada com sucesso',
        });
      } else {
        toast({
          description: 'Ops! Houve um problema durante a edição. Por favor, tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    } else {
      const response = await fetch('/api/finance/money-location', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          description: values.description,
          type: values.type,
        }),
      });

      if (response.ok) {
        toast({
          description: 'Localização dinheiro cadastrada com sucesso',
        });
      } else {
        toast({
          description: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição do local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do dinheiro</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do dinheiro" />
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
          <Button className="w-full mt-6" type="submit">
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MoneyLocationForm;
