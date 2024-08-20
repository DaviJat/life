import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Importa o objeto 'db' ORM (Object-Relational Mapping) do prisma para interagir com o banco de dados.
import authOptions from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const walletEntrySchema = z.object({
  description: z.string().min(1).max(60),
  amount: z.number().max(9999999999999),
  walletId: z.number(),
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  try {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    if (id) {
      // Busca um registro de walletEntry pelo id no banco de dados.
      const walletEntry = await db.walletEntry.findUnique({
        where: {
          id: parseInt(id),
          userId: parseInt(userId)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(walletEntry);
    }
    // Se não houver 'id' na URL, busca todos os registros de walletEntry no banco de dados.
    const walletEntries = await db.walletEntry.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        wallet: true
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(walletEntries);

  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante a busca no banco de dados.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde' }, { status: 500 });
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
    const { description, amount, walletId } = walletEntrySchema.parse(body);

    // Cria um novo registro de wallet no banco de dados com os dados recebidos.
    const newWalletEntry = await db.walletEntry.create({
      data: {
        description,
        amount,
        walletId,
        userId: parseInt(userId)
      }
    })

    // Atualiza o saldo da carteira no banco de dados.
    await db.wallet.update({
      where: {
        id: walletId,
        userId: parseInt(userId)
      },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json({ walletEntry: newWalletEntry, message: 'Entrada registrada com sucesso' }, { status: 201 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições PUT.
export async function PUT(request: NextRequest) {
  try {
    // Extrai o 'id' da URL da requisição.
    const id = Number(request.nextUrl.searchParams.get("id"));

    // Obtém o parâmetro 'userId' da sessão do usuário
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Extrai o corpo da requisição PUT.
    const body = await request.json();

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, amount, walletId } = walletEntrySchema.parse(body);

    // Encontra a entrada de carteira no banco de dados com o id fornecido.
    const walletEntry = await db.walletEntry.findUnique({ where: { id: id } });

    // Salva o valor anterior.
    const previousAmount = walletEntry.amount;

    // Atualiza o registro da entrada de carteira no banco de dados com o id fornecido.
    const updatedWalletEntry = await db.walletEntry.update({
      where: {
        id: id,
        userId: parseInt(userId)
      },
      data: {
        description,
        amount,
        walletId
      }
    });

    // Calcula a diferença entre o novo valor e o anterior.
    const difference = amount - previousAmount;

    // Atualiza o saldo da carteira com base na diferença.
    await db.wallet.update({
      where: {
        id: walletId,
        userId: parseInt(userId)
      },
      data: {
        balance: {
          increment: difference
        }
      }
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ walletEntry: updatedWalletEntry, message: 'Entrada alterada com sucesso' }, { status: 200 });
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

    // Deleta o registro de walletEntry no banco de dados com o id recebido.
    const deletedWalletEntry = await prisma.walletEntry.delete({
      where: {
        id: id,
        userId: parseInt(userId)
      },
    })

    // Atualiza o saldo da carteira subtraindo o montante da entrada excluída.
    await db.wallet.update({
      where: {
        id: deletedWalletEntry.walletId,
        userId: parseInt(userId)
      },
      data: {
        balance: {
          decrement: deletedWalletEntry.amount
        }
      }
    });

    // Retorna uma resposta de sucesso após a exclusão.
    return NextResponse.json({ walletEntry: deletedWalletEntry, message: 'Entrada excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}
