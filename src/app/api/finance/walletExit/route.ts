import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Importa o objeto 'db' ORM (Object-Relational Mapping) do prisma para interagir com o banco de dados.
import db from "@/lib/db";

// Define um schema utilizando a biblioteca Zod para validar os dados recebidos nas requisições.
const userSchema = z.object({
    description: z.string().min(1).max(60),
    amount: z.number().max(9999999999999),
    walletId: z.number(),
});

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");
    try {
        if (id) {
            // Busca um registro de walletExit pelo id no banco de dados.
            const walletExit = await db.walletExit.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            // Retorna o registro encontrado em formato JSON.
            return NextResponse.json(walletExit);
        } else {
            // Se não houver 'id' na URL, busca todos os registros de walletExit no banco de dados.
            const walletExits = await db.walletExit.findMany({
                orderBy: {
                    id: 'desc'
                },
                include: {
                    wallet: true
                }
            });
            // Retorna os registros encontrados em formato JSON.
            return NextResponse.json(walletExits);
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

        // Valida o corpo da requisição com o schema definido anteriormente.
        const { description, amount, walletId } = userSchema.parse(body);

        // Cria um novo registro de wallet no banco de dados com os dados recebidos.
        const newWalletExit = await db.walletExit.create({
            data: {
                description,
                amount,
                walletId
            }
        })

        // Atualiza o saldo da carteira no banco de dados.
        await db.wallet.update({
            where: {
                id: walletId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });

        // Retorna uma resposta de sucesso com o novo registro criado.
        return NextResponse.json({ walletExit: newWalletExit, message: 'Saída registrada com sucesso' }, { status: 201 });
    } catch (error) {
        // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
        return NextResponse.json({ message: 'Ops! Houve um problema durante o cadastro. Por favor, tente novamente mais tarde' }, { status: 500 });
    }
}

// Função assíncrona para lidar com requisições PUT.
export async function PUT(request: NextRequest) {
    try {
        // Extrai o 'id' da URL da requisição.
        const id = Number(request.nextUrl.searchParams.get("id"));

        // Extrai o corpo da requisição PUT.
        const body = await request.json();

        // Valida o corpo da requisição com o schema definido anteriormente.
        const { description, amount, walletId } = userSchema.parse(body);

        // Encontra a entrada de carteira no banco de dados com o id fornecido.
        const walletExit = await db.walletExit.findUnique({ where: { id: id } });

        // Salva o valor anterior.
        const previousAmount = walletExit.amount;

        // Atualiza o registro da entrada de carteira no banco de dados com o id fornecido.
        const updatedWalletExit = await db.walletExit.update({
            where: { id },
            data: { description, amount, walletId }
        });

        // Calcula a diferença entre o novo valor e o anterior.
        const difference = amount - previousAmount;

        // Atualiza o saldo da carteira com base na diferença.
        await db.wallet.update({
            where: { id: walletId },
            data: { balance: { decrement: difference } }
        });

        // Retorna uma resposta de sucesso com o registro atualizado.
        return NextResponse.json({ walletExit: updatedWalletExit, message: 'Saída alterada com sucesso' }, { status: 200 });
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

        // Deleta o registro de walletExit no banco de dados com o id recebido.
        const deletedWalletExit = await prisma.walletExit.delete({
            where: {
                id: id,
            },
        })

        // Atualiza o saldo da carteira subtraindo o montante da entrada excluída.
        await db.wallet.update({
            where: { id: deletedWalletExit.walletId },
            data: { balance: { increment: deletedWalletExit.amount } }
        });

        // Retorna uma resposta de sucesso após a exclusão.
        return NextResponse.json({ walletExit: deletedWalletExit, message: 'Saída excluída com sucesso' }, { status: 200 });
    } catch (error) {
        // Retorna uma resposta de erro caso ocorra uma exceção durante o processamento da requisição.
        return NextResponse.json({ message: 'Ops! Houve um problema durante a exclusão. Por favor, tente novamente mais tarde' }, { status: 500 });
    }
}
