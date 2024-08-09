import authOptions from '@/lib/auth';
import db from "@/lib/db";
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const personSchema = z.object({
  name: z.string().min(1).max(30),
  phone: z.string().min(1).max(30),
  userId: z.number()
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  try {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");

    // Recuperando id do usuário na sessão
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    if (id) {
      // Busca um registro de person pelo id no banco de dados.
      const person = await db.person.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (parseInt(userId) != person.userId) {
        return NextResponse.json(
          {
            message:
              'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde'
          },
          { status: 401 }
        );
      }

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(person);
    } else {
      // Se não houver 'id' na URL, busca todos os registros de person no banco de dados.
      const persons = await db.person.findMany({
        where: {
          userId: parseInt(userId)
        },
        orderBy: {
          id: 'desc'
        }
      });
      // Retorna os registros encontrados em formato JSON.
      return NextResponse.json(persons);
    }
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

    // Recuperando id do usuário na sessão
    const session = await getServerSession(authOptions);
    const userId = session.user.id

    // Valida o corpo da requisição com o schema definido anteriormente.
    const { name, phone } = personSchema.parse(body);

    // Cria um novo registro de person no banco de dados com os dados recebidos.
    const newPerson = await db.person.create({
      data: {
        name,
        phone,
        userId: parseInt(userId)
      }
    })

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json({ person: newPerson, message: 'Pessoa cadastrada com sucesso' }, { status: 201 });
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
    const { name, phone } = personSchema.parse(body);

    // Atualiza o registro de person no banco de dados com o id recebido.
    const updatedPerson = await db.person.update({
      where: {
        id: id,
      },
      data: {
        name,
        phone,
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ wallet: updatedPerson, message: 'Pessoa editada com sucesso' }, { status: 200 });
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

    // Deleta o registro de person no banco de dados com o id recebido.
    const deletePerson = await prisma.person.delete({
      where: {
        id: id,
      },
    })

    // Retorna uma resposta de sucesso após a exclusão.
    return NextResponse.json({ person: deletePerson, message: 'Pessoa excluída com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}