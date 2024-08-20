import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Importa o objeto 'db' que parece ser um ORM (Object-Relational Mapping) para interagir com o banco de dados.
import authOptions from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const walletSchema = z.object({
  description: z.string().min(1).max(30),
  balance: z.number().max(9999999999999),
  type: z.enum(['Physical', 'Virtual'])
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
      // Busca um registro de wallet pelo id no banco de dados.
      const wallet = await db.wallet.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(wallet);
    }
    // Se não houver 'id' na URL, busca todos os registros de wallet no banco de dados.
    const wallets = await db.wallet.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(wallets);

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
    const { description, balance, type } = walletSchema.parse(body);

    // Cria um novo registro de wallet no banco de dados com os dados recebidos.
    const newWallet = await db.wallet.create({
      data: {
        description,
        balance,
        type,
        userId: parseInt(userId)
      }
    })

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json({ wallet: newWallet, message: 'Carteira cadastrada com sucesso' }, { status: 201 });
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
    const { description, balance, type } = walletSchema.parse(body);

    // Atualiza o registro de wallet no banco de dados com o id recebido.
    const updatedWallet = await db.wallet.update({
      where: {
        id: id,
        userId: parseInt(userId)
      },
      data: {
        description,
        balance,
        type,
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ wallet: updatedWallet, message: 'Carteira editada com sucesso' }, { status: 200 });
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

    // Deleta o registro de wallet no banco de dados com o id recebido.
    const deleteWallet = await prisma.wallet.delete({
      where: {
        id: id,
        userId: parseInt(userId)
      },
    })

    // Retorna uma resposta de sucesso após a exclusão.
    return NextResponse.json({ wallet: deleteWallet, message: 'Carteira excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}
