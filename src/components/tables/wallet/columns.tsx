'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const columns: ColumnDef<Wallet>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button className="px-2" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Id
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="px-2">{row.getValue('id')}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button className="px-2" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Descrição
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="px-2">{row.getValue('description')}</div>;
    },
  },
  {
    accessorKey: 'balance',
    header: 'Saldo',
    cell: ({ row }) => {
      const balance = Number(row.getValue('balance'));
      const formattedBalance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance);
      return formattedBalance;
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type');
      const typeTranslated = type === 'Physical' ? 'Física' : type === 'Virtual' ? 'Virtual' : type;
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      const router = useRouter();

      const [openDialog, setOpenDialog] = useState(false);

      // Função para lidar com a exclusão do item
      const handleDelete = async (id) => {
        const response = await fetch(`/api/finance/wallet/?id=${id}`, {
          method: 'DELETE',
          cache: 'no-store',
          headers: {
            'Content-type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Se a resposta for bem-sucedida
          toast({
            // Exibe um toast de sucesso
            description: data.message,
          });
          setOpenDialog(false);
          router.refresh();
        } else {
          // Se a resposta não for bem-sucedida
          toast({
            // Exibe um toast de erro
            description: data.message,
            variant: 'destructive',
          });
        }
      };

      return (
        <>
          <Dialog open={openDialog}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => (window.location.href = '/finance/wallet/' + payment.id)}>
                  Editar
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem onClick={() => setOpenDialog(true)}>Excluir</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir</DialogTitle>
                <DialogDescription>Você tem certeza que quer excluir esse item definitivamente?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex items-center justify-center">
                  <Button onClick={async () => handleDelete(payment.id)} variant="destructive">
                    Excluir
                  </Button>
                  <DialogClose asChild>
                    <Button className="ml-2" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
