'use client';

import { MoneyLocation } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<MoneyLocation>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type');
      const typeTranslated = type === 'Physical' ? 'Físico' : type === 'Virtual' ? 'Virtual' : type;
      return typeTranslated;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data cadastro',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const formatted = date.toLocaleDateString();
      return formatted;
    },
  },
];
