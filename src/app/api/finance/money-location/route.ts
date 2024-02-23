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
      const moneyLocation = await db.moneyLocation.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      return NextResponse.json(moneyLocation);
    } else {
      const moneyLocations = await db.moneyLocation.findMany();
      return NextResponse.json(moneyLocations);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
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

    return NextResponse.json({ moneyLocation: newMoneyLocation, message: 'Local dinheiro cadastrado com sucesso' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    const body = await request.json();
    const { description, type } = userSchema.parse(body);

    const updatedMoneyLocation = await db.moneyLocation.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        description,
        type,
      },
    });

    return NextResponse.json({ moneyLocation: updatedMoneyLocation, message: 'Local dinheiro editado com sucesso' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
  }
}
