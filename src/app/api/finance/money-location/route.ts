import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import db from "@/lib/db";

const userSchema = z.object({
  description: z.string().min(1, 'Description is required').max(60),
  type: z.enum(['Physical', 'Virtual']),
});

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  try {
    if (id) {
      // Busca uma localização única se um ID for passado
      const moneyLocation = await db.moneyLocation.findUnique({
        where: {
          id: parseInt(id)
        }
      });
      if (!moneyLocation) {
        return NextResponse.json({ message: 'Localização não encontrada' }, { status: 404 });
      }
      return NextResponse.json(moneyLocation);
    } else {
      // Busca várias localizações se nenhum ID for passado
      const moneyLocations = await db.moneyLocation.findMany();
      return NextResponse.json(moneyLocations);
    }
  } catch (error) {
    console.error("Erro ao buscar localizações de dinheiro:", error);
    return NextResponse.json({ message: 'Ocorreu um erro ao buscar as localizações de dinheiro' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, type } = userSchema.parse(body);

    const newMoneyLocation = await db.moneyLocation.create({
      data: {
        description,
        type
      }
    })
    return NextResponse.json({ moneyLocation: newMoneyLocation, message: 'Money location created successfully' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    // Verificar se o parâmetro id está presente e é uma string não vazia
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is missing or invalid' }, { status: 400 });
    }

    const body = await request.json();
    const { description, type } = userSchema.parse(body);

    // Verificar se a localização do dinheiro com o ID fornecido existe
    const existingMoneyLocation = await db.moneyLocation.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    // Se a localização do dinheiro não existir, retorne um erro 404
    if (!existingMoneyLocation) {
      return NextResponse.json({ message: 'Money location not found' }, { status: 404 });
    }

    // Atualizar a localização do dinheiro com os novos dados
    const updatedMoneyLocation = await db.moneyLocation.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        description,
        type,
      },
    });

    return NextResponse.json({ moneyLocation: updatedMoneyLocation, message: 'Money location updated successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
