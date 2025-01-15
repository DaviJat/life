import { useEffect, useReducer } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type IntegerInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  value: string | number;
  placeholder: string;
  maxLength?: number; // Parâmetro opcional maxLength
  minValue?: number; // Parâmetro opcional minValue
};

export default function IntegerInput(props: IntegerInputProps) {
  const initialValue = props.form.getValues()[props.name] || '';

  const [value, setValue] = useReducer((_, next: string) => {
    // Remove caracteres não numéricos e aplica o limite de caracteres
    return props.maxLength ? next.replace(/\D/g, '').slice(0, props.maxLength) : next.replace(/\D/g, '');
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, '').slice(0, props.maxLength); // Aplica o limite de caracteres
    let realValue = Number(digits);

    // Aplica o valor mínimo, se definido
    if (props.minValue !== undefined && realValue < props.minValue) {
      realValue = props.minValue;
    }

    realChangeFn(realValue);
  }

  useEffect(() => {
    if (props.value !== undefined) {
      let formattedValue = String(props.value).slice(0, props.maxLength); // Formata valor inicial com limite
      let realValue = Number(formattedValue);

      // Aplica o valor mínimo, se definido
      if (props.minValue !== undefined && realValue < props.minValue) {
        realValue = props.minValue;
        formattedValue = String(realValue);
      }

      setValue(formattedValue);
    }
  }, [props.form, props.value, props.maxLength, props.minValue]);

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
                type="number"
                {...field}
                onChange={(ev) => {
                  const inputValue = ev.target.value;
                  setValue(inputValue); // Filtra e aplica limite
                  handleChange(_change, inputValue);
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
