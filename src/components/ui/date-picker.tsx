'use client';

import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Calendar } from '../ui/calendar';

interface Props {
  field: any;
  placeholder: string;
  value?: string | Date; // Valor inicial opcional (string ou Date)
}

const DatePicker = ({ field, placeholder, value }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [stringDate, setStringDate] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isDateDisabled = (date: Date) => {
    return date > new Date() || date < new Date('1900-01-01');
  };

  const handleOnSelect: SelectSingleEventHandler = (date) => {
    if (isDateDisabled(date as Date)) {
      setStringDate('');
      field.onChange(undefined);
      return;
    }
    field.onChange(date);
    setIsPopoverOpen(false);
    setStringDate(format(date as Date, 'dd/MM/yyyy')); // Formata para dd/MM/yyyy
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9/]/g, ''); // Remove caracteres inválidos
    const digits = input.replace(/\D/g, ''); // Apenas números

    // Aplica a formatação dd/MM/yyyy conforme o usuário digita
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    setStringDate(formatted.slice(0, 10)); // Limita ao formato dd/MM/yyyy

    // Atualiza o valor no Zod
    const parsedDate = parse(formatted.slice(0, 10), 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
      field.onChange(parsedDate); // Atualiza o valor no formulário
    }
  };

  const handleBlur = () => {
    if (!stringDate) {
      setStringDate('');
      field.onChange(undefined);
      return;
    }

    const parsedDate = parse(stringDate, 'dd/MM/yyyy', new Date());

    if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
      field.onChange(parsedDate);
      setStringDate(format(parsedDate, 'dd/MM/yyyy'));
    } else {
      field.onChange(null);
    }
  };

  // Atualiza stringDate com o valor inicial da prop "value"
  useEffect(() => {
    if (value) {
      const formattedValue = typeof value === 'string' ? value : format(value as Date, 'dd/MM/yyyy');
      setStringDate(formattedValue);
      field.onChange(formattedValue); // Sincroniza com o campo do formulário
    }
  }, [value, field]);

  return (
    <div className="relative w-full">
      <FormControl>
        {/* Input para digitação manual */}
        <Input
          type="text"
          value={stringDate}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-3 text-left font-normal"
          ref={inputRef}
        />
      </FormControl>

      {/* Ícone que abre o Popover */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsPopoverOpen(true)}
          >
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={handleOnSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
