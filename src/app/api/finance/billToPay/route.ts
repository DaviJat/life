import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import authOptions from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const billToPaySchema = z.object({
  description: z.string().min(1).max(30),
  value: z.number().max(9999999999999),
  personId: z.number()
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  try {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get('id');

    // Recuperando id do usuário na sessão
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    if (id) {
      // Busca um registro de conta a pagar pelo id no banco de dados.
      const billToPay = await db.billToPay.findUnique({
        where: {
          id: parseInt(id),
        }
      });

      if (parseInt(userId) != billToPay.userId) {
        return NextResponse.json(
          {
            message:
              'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde'
          },
          { status: 401 }
        );
      }

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(billToPay);
    }
    // Se não houver 'id' na URL, busca todos os registros de conta a pagar no banco de dados.
    const billsToPay = await db.billToPay.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        person: true
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(billsToPay);
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante a busca no banco de dados.
    return NextResponse.json(
      {
        message:
          'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde'
      },
      { status: 500 }
    );
  }
}

// Função assíncrona para lidar com requisições POST.
export async function POST(request: NextRequest) {
  try {
    // Obtém o corpo da requisição POST.
    const body = await request.json();

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, value, personId } = billToPaySchema.parse(body);

    // Recuperando id do usuário na sessão
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Cria um novo registro de conta a pagar no banco de dados com os dados recebidos.
    const newBillToPay = await db.billToPay.create({
      data: {
        description,
        value,
        userId: parseInt(userId),
        personId
      }
    });

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json(
      {
        billToPay: newBillToPay,
        message: 'Conta a pagar cadastrada com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições PUT.
export async function PUT(request: NextRequest) {
  try {
    // Obtém o 'id' da URL da requisição.
    const id = Number(request.nextUrl.searchParams.get("id"));

    // Obtém o corpo da requisição PUT.
    const body = await request.json();

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, value, personId } = billToPaySchema.parse(body);

    // Atualiza o registro de conta a pagar no banco de dados com o id recebido.
    const updatedBillToPay = await db.billToPay.update({
      where: {
        id: id,
      },
      data: {
        description,
        value,
        personId,
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ billToPay: updatedBillToPay, message: 'Conta a pagar editada com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a edição. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições DELETE.
export async function DELETE(request: NextRequest) {
  try {
    // Obtém o 'id' da URL da requisição.
    const id = Number(request.nextUrl.searchParams.get("id"));

    // Deleta o registro de conta a pagar no banco de dados com o id recebido.
    const deleteBillToPay = await prisma.billToPay.delete({
      where: {
        id: id,
      },
    })

    // Retorna uma resposta de sucesso após a excslusão.
    return NextResponse.json({ billToPay: deleteBillToPay, message: 'Conta a pagar excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}