import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import authOptions from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const paidPaymentsSchema = z.object({
  paymentDate: z.string().datetime(),
  amountPaid: z.number().max(9999999999999),
  walletExitId: z.number(),
  billToPayId: z.number()
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  try {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get('id');

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    if (id) {
      // Busca um registro de paidPayments pelo id no banco de dados.
      const paidPayments = await db.paidPayments.findUnique({
        where: {
          id: parseInt(id),
          userId: parseInt(userId)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(paidPayments);
    }
    // Se não houver 'id' na URL, busca todos os registros de paidPayments no banco de dados.
    const paidPayments = await db.paidPayments.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(paidPayments);
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

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { paymentDate, amountPaid, walletExitId, billToPayId } = paidPaymentsSchema.parse(body);

    // Cria um novo registro de paidPayments no banco de dados com os dados recebidos.
    const newpaidPayments = await db.paidPayments.create({
      data: {
        paymentDate,
        amountPaid,
        walletExitId,
        billToPayId,
        userId: parseInt(userId)
      }
    });

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json(
      {
        paidPayments: newpaidPayments,
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

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Obtém o corpo da requisição PUT.
    const body = await request.json();

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { paymentDate, amountPaid, walletExitId, billToPayId } = paidPaymentsSchema.parse(body);

    // Atualiza o registro de paidPayments no banco de dados com o id recebido.
    const updatedpaidPayments = await db.paidPayments.update({
      where: {
        id: id,
        userId: parseInt(userId)
      },
      data: {
        paymentDate,
        amountPaid,
        walletExitId,
        billToPayId
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ paidPayments: updatedpaidPayments, message: 'Pagamento editado com sucesso' }, { status: 200 });
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

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Deleta o registro de paidPayments no banco de dados com o id recebido.
    const deletepaidPayments = await prisma.paidPayments.delete({
      where: {
        id: id,
        userId: parseInt(userId)
      },
    })

    // Retorna uma resposta de sucesso após a excslusão.
    return NextResponse.json({ paidPayments: deletepaidPayments, message: 'Pagamento excluído com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}