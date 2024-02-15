'use client';

import { ColumnDef } from '@tanstack/react-table';

export type MoneyLocation = {
  id: number;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<MoneyLocation>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
];
