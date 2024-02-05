'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const FormSchema = z.object({
  description: z.string().max(20),
});

function MoneyLocationForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/finance/money-location', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: values.description,
      }),
    });
  };

  return (
    <div>
      <h1>MoneyLocationForm</h1>
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
          <Button className="w-full mt-6" type="submit">
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MoneyLocationForm;
