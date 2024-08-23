// Este arquivo contém funções utilitárias para facilitar o trabalho com classes CSS em componentes React.

// Importa as funções necessárias para mesclar classes CSS de forma mais eficiente.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Função "cn" (short for "classNames") para mesclar várias classes CSS em uma única string.
export function cn(...inputs: ClassValue[]) {
  // Usa a função "clsx" para mesclar as classes CSS fornecidas.
  // Em seguida, utiliza a função "twMerge" para otimizar a mesclagem de classes, especialmente para classes do Tailwind CSS.
  return twMerge(clsx(inputs));
}

// Arquivo criado junto com a instalação do shadcn/ui

import { useEffect, useState } from "react";

const useFormattedDate = (date: string) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString("pt-BR"));
  }, [date]);

  return formattedDate;
};

// Corrigido para exportar a função corretamente
export default useFormattedDate;
