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
  maxLength?: number; // Quantidade máxima de dígitos antes da vírgula
};

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function MoneyInput(props: TextInputProps) {
  const initialValue = props.form.getValues()[props.name] || '';

  const [value, setValue] = useReducer((_, next: string) => {
    const digits = next.replace(/\D/g, ''); // Remove tudo que não for número

    // Aplica o limite de dígitos
    const maxDigits = props.maxLength || 9; // Padrão: 9 dígitos (9.999.999,99)
    const limitedDigits = digits.slice(0, maxDigits);

    return moneyFormatter.format(Number(limitedDigits) / 100);
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, ''); // Remove não numéricos

    // Aplica o limite de dígitos
    const maxDigits = props.maxLength || 9;
    const limitedDigits = digits.slice(0, maxDigits);

    const realValue = Number(limitedDigits) / 100;

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
                maxLength={props.maxLength ? props.maxLength + 6 : 12} // Adiciona espaço para os pontos e vírgula
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
