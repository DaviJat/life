import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import db from '@/lib/db';

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const billstrSchema = z.object({
  description: z.string().min(1).max(30),
  value: z.number().max(9999999999999),
  personId: z.number()
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  // Obtém o parâmetro 'id' da URL da requisição.
  const id = request.nextUrl.searchParams.get('id');
  try {
    if (id) {
      // Busca um registro de billsToReceive pelo id no banco de dados.
      const billsToReceive = await db.billsToReceive.findUnique({
        where: {
          id: parseInt(id, 10)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(billsToReceive);
    }
    // Se não houver 'id' na URL, busca todos os registros de billsToReceive no banco de dados.
    const billsToReceive = await db.billsToReceive.findMany({
      orderBy: {
        id: 'desc'
      },
      include: {
        person: true
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(billsToReceive);
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
    const { description, value, personId } = billstrSchema.parse(body);

    // Cria um novo registro de billsToReceive no banco de dados com os dados recebidos.
    const newbillsToReceive = await db.billsToReceive.create({
      data: {
        description,
        value,
        personId
      }
    });

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json(
      {
        billsToReceive: newbillsToReceive,
        message: 'Conta a receber cadastrada com sucesso'
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
    const { description, value, personId } = billstrSchema.parse(body);

    // Atualiza o registro de billsToReceive no banco de dados com o id recebido.
    const updatedbillsToReceive = await db.billsToReceive.update({
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
    return NextResponse.json({ billsToReceive: updatedbillsToReceive, message: 'Conta a receber editada com sucesso' }, { status: 200 });
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

    // Deleta o registro de billsToReceive no banco de dados com o id recebido.
    const deletebillsToReceive = await prisma.billsToReceive.delete({
      where: {
        id: id,
      },
    })

    // Retorna uma resposta de sucesso após a excslusão.
    return NextResponse.json({ billsToReceive: deletebillsToReceive, message: 'Conta a receber excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}