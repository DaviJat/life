import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Importa o objeto 'db' que parece ser um ORM (Object-Relational Mapping) para interagir com o banco de dados.
import db from "@/lib/db";

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const userSchema = z.object({
  description: z.string().min(1, 'Description is required').max(30),
  type: z.enum(['Physical', 'Virtual']),
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
  // Obtém o parâmetro 'id' da URL da requisição.
  const id = request.nextUrl.searchParams.get("id");
  try {
    if (id) {
      // Busca um registro de moneyLocation pelo id no banco de dados.
      const moneyLocation = await db.moneyLocation.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(moneyLocation);
    } else {
      // Se não houver 'id' na URL, busca todos os registros de moneyLocation no banco de dados.
      const moneyLocations = await db.moneyLocation.findMany({
        orderBy: {
          id: 'desc'
        }
      });
      // Retorna os registros encontrados em formato JSON.
      return NextResponse.json(moneyLocations);
    }
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante a busca no banco de dados.
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições POST.
export async function POST(request: NextRequest) {
  try {
    // Obtém o corpo da requisição POST.
    const body = await request.json();
    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, type } = userSchema.parse(body);

    // Cria um novo registro de moneyLocation no banco de dados com os dados recebidos.
    const newMoneyLocation = await db.moneyLocation.create({
      data: {
        description,
        type
      }
    })

    // Retorna uma resposta de sucesso com o novo registro criado.
    return NextResponse.json({ moneyLocation: newMoneyLocation, message: 'Local dinheiro cadastrado com sucesso' }, { status: 201 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições PUT.
export async function PUT(request: NextRequest) {
  try {
    // Obtém o 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");

    // Obtém o corpo da requisição PUT.
    const body = await request.json();
    // Valida o corpo da requisição com o schema definido anteriormente.
    const { description, type } = userSchema.parse(body);

    // Atualiza o registro de moneyLocation no banco de dados com os dados recebidos.
    const updatedMoneyLocation = await db.moneyLocation.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        description,
        type,
      },
    });

    // Retorna uma resposta de sucesso com o registro atualizado.
    return NextResponse.json({ moneyLocation: updatedMoneyLocation, message: 'Local dinheiro editado com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

// Função assíncrona para lidar com requisições DELETE.
export async function DELETE(request: NextRequest) {
  try {
    // Obtém o 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");

    // Realiza a exclusão do registro de moneyLocation no banco de dados.

    // Retorna uma resposta de sucesso após a exclusão.
    return NextResponse.json({ message: 'Local dinheiro excluído com sucesso' }, { status: 200 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}
