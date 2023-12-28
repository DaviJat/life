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
      return NextResponse.json({ usuario: null, message: 'Email já cadastrado.' }, { status: 201 })
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

    const { senha: senhaNovoUsuario, ...rest } = novoUsuario;

    return NextResponse.json({ usuario: rest, message: 'Usuário cadastrado com sucesso.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Algo de errado aconteceu.' }, { status: 500 });
  }
}