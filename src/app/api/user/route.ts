import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import authOptions from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(30),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must have than 8 characters')
  })

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ authenticated: !!session })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest, message: 'Cadastro realizado com sucesso! Agora você pode fazer login.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde.' }, { status: 500 });
  }
}