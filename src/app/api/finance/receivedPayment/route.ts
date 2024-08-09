import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

import db from '@/lib/db';

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const receivedPaymentSchema = z.object({
  paymentDate: z.string().datetime(),
  amountReceived: z.number().max(9999999999999),
  walletEntryId: z.number(),
  billToReceiveId: z.number()
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
      // Busca um registro de receivedPayments pelo id no banco de dados.
      const receivedPayments = await db.receivedPayments.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (parseInt(userId) != receivedPayments.userId) {
        return NextResponse.json(
          {
            message:
              'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde'
          },
          { status: 401 }
        );
      }

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(receivedPayments);
    }
    // Se não houver 'id' na URL, busca todos os registros de receivedPayments no banco de dados.
    const receivedPayments = await db.receivedPayments.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(receivedPayments);
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
    const { paymentDate, amountReceived, walletEntryId, billToReceiveId } = receivedPaymentSchema.parse(body);

    // Recuperando id do usuário na sessão
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Cria um novo registro de receivedPayments no banco de dados com os dados recebidos.
    const newReceivedPayments = await db.receivedPayments.create({
      data: {
        paymentDate,
        amountReceived,
        walletEntryId,
        userId: parseInt(userId),
        billToReceiveId
      }
    });

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json(
      {
        receivedPayments: newReceivedPayments,
        message: 'Pagamento cadastrado com sucesso'
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
    const { paymentDate, amountReceived, walletEntryId, billToReceiveId } = receivedPaymentSchema.parse(body);

    // Atualiza o registro de receivedPayments no banco de dados com o id recebido.
    const updatedReceivedPayments = await db.receivedPayments.update({
      where: {
        id: id,
      },
      data: {
        paymentDate,
        amountReceived,
        walletEntryId,
        billToReceiveId
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ receivedPayments: updatedReceivedPayments, message: 'Pagamento editado com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições DELETE.
export async function DELETE(request: NextRequest) {
  try {
    // Obtém o 'id' da URL da requisição.
    const id = Number(request.nextUrl.searchParams.get("id"));

    // Deleta o registro de ReceivedPayments no banco de dados com o id recebido.
    const deleteReceivedPayments = await prisma.receivedPayments.delete({
      where: {
        id: id,
      },
    })

    // Retorna uma resposta de sucesso após a excslusão.
    return NextResponse.json({ ReceivedPayments: deleteReceivedPayments, message: 'Pagamento excluído com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}