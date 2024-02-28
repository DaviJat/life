import { useEffect, useReducer } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  value: string;
  placeholder: string;
};

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function MoneyInput(props: TextInputProps) {
  const initialValue = props.form.getValues()[props.name] || '';

  const [value, setValue] = useReducer((_, next: string) => {
    const digits = next.replace(/\D/g, '');
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, '');
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  useEffect(() => {
    if (props.value) {
      setValue((Number(props.value) * 100).toString());
    }
  }, [props.form, props.value]);

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        const _change = field.onChange;
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
