import authOptions from "@/lib/auth";
import db from "@/lib/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos na requisição de criação de usuário.
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
  });

// Função assíncrona para lidar com requisições GET.
export async function GET() {
  // Obtém a sessão do usuário a partir das opções de autenticação.
  const session = await getServerSession(authOptions);

  // Retorna uma resposta JSON indicando se o usuário está autenticado ou não.
  return NextResponse.json({ authenticated: !!session });
}

// Função assíncrona para lidar com requisições POST de criação de usuário.
export async function POST(request: NextRequest) {
  try {
    // Obtém o corpo da requisição POST.
    const body = await request.json();
    // Valida os dados recebidos com o schema definido anteriormente.
    const { email, username, password } = userSchema.parse(body);

    // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.
    const existingUserByEmail = await db.user.findUnique({
      where: { email }
    });

    // Se o usuário já existir, retorna uma mensagem de erro.
    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.' }, { status: 409 })
    }

    // Hash da senha do usuário utilizando a biblioteca bcrypt.
    const hashedPassword = await hash(password, 10);
    // Cria um novo usuário no banco de dados com os dados recebidos.
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })

    // Retorna uma resposta de sucesso com os dados do novo usuário criado.
    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json({ user: rest, message: 'Cadastro realizado com sucesso! Agora você pode fazer login.' }, { status: 201 });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
