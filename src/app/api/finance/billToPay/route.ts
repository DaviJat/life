import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import authOptions from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const billToPaySchema = z.object({
  description: z.string().min(1).max(60),
  value: z.number().max(9999999.99).nullable(),
  personId: z.string().max(5).nullable(),
  paymentType: z.enum(['Cash', 'Installment']).nullable(),
  dueDate: z.string().nullable(),
  installmentsNumber: z.number().int().max(99).nullable(),
  isPaid: z.boolean().nullable()
});

// Função assíncrona para lidar com requisições POST.
export async function POST(request: NextRequest) {
  try {
    // Obtém o corpo da requisição POST.
    const body = await request.json();

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = parseInt(session.user.id);

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, value, personId, paymentType, dueDate, installmentsNumber, isPaid } = billToPaySchema.parse(body);

    // Define o número de parcelas como 1 se for null ou undefined
    const totalInstallments = installmentsNumber ?? 1;

    // Cria um novo registro de conta a pagar no banco de dados com os dados recebidos.
    const newBillToPay = await db.billToPay.create({
      data: {
        description,
        value: value !== null ? value : 0, // Valor padrão: 0
        personId: personId !== null ? parseInt(personId) : null, // Valor padrão: null
        paymentType: paymentType !== null ? paymentType : 'Cash', // Valor padrão: 'Cash'
        dueDate: dueDate !== null ? dueDate : null, // Valor padrão: null
        isPaid: isPaid !== null ? isPaid : false, // Valor padrão: false
        userId,
      }
    });

    const billToPayId = newBillToPay.id;

    // Se o tipo de pagamento for "Installment" (parcelado), cria as parcelas.
    if (paymentType === "Installment") {
      const installmentValue = parseFloat((value / totalInstallments).toFixed(2));

      for (let i = 0; i < totalInstallments; i++) {
        let installmentDueDate = null;

        // Define a data de vencimento da parcela, se `dueDate` não for nulo
        if (dueDate) {
          installmentDueDate = new Date(dueDate);
          installmentDueDate.setMonth(installmentDueDate.getMonth() + i);
        }

        await db.installment.create({
          data: {
            billToPay: { connect: { id: billToPayId } },
            value: installmentValue,
            dueDate: installmentDueDate,
            isPaid: isPaid !== null ? isPaid : false,
          }
        });
      }
    }

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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  try {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get('id');

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    if (id) {
      // Busca um registro de conta a pagar pelo id no banco de dados.
      const billToPay = await db.billToPay.findUnique({
        where: {
          id: parseInt(id),
          userId: parseInt(userId)
        }
      });

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
    const { description, value, personId } = billToPaySchema.parse(body);

    // Atualiza o registro de conta a pagar no banco de dados com o id recebido.
    const updatedBillToPay = await db.billToPay.update({
      where: {
        id: id,
        userId: parseInt(userId)
      },
      data: {
        description,
        value,
        personId: parseInt(personId),
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

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Deleta o registro de conta a pagar no banco de dados com o id recebido.
    const deleteBillToPay = await prisma.billToPay.delete({
      where: {
        id: id,
        userId: parseInt(userId)
      },
    })

    // Retorna uma resposta de sucesso após a excslusão.
    return NextResponse.json({ billToPay: deleteBillToPay, message: 'Conta a pagar excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}