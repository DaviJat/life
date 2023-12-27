import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";

export async function GET() {
  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, senha, nome, sobrenome } = body;

    // Verificar se email já foi cadastrado
    const verificaEmailCadastrado = await db.usuario.findUnique({
      where: { email }
    });

    if (verificaEmailCadastrado) {
      return NextResponse.json({ error: 'Email já cadastrado' })
    }

    const senhaEncriptada = await hash(senha, 10);
    const novoUsuario = await db.usuario.create({
      data: {
        email,
        senha: senhaEncriptada,
        nome,
        sobrenome
      }
    })

    return NextResponse.json({ usuario: novoUsuario, message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    return error;
  }
}