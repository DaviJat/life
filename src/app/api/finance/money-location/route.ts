import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import authOptions from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

const userSchema = z.object({
  description: z.string().min(1, 'Description is required').max(60),
  type: z.enum(['Physical', 'Virtual']),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ authenticated: !!session })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, type } = userSchema.parse(body);

    console.log(body);

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