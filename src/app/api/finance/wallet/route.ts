import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Função assíncrona para lidar com requisições GET.
export async function GET(request: NextRequest) {
    // Obtém o parâmetro 'id' da URL da requisição.
    const id = request.nextUrl.searchParams.get("id");
    try {
        if (id) {
            // Busca um registro de wallet pelo id no banco de dados.
            const wallet = await db.wallet.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            // Retorna o registro encontrado em formato JSON.
            return NextResponse.json(wallet);
        } else {
            // Se não houver 'id' na URL, busca todos os registros de wallet no banco de dados.
            const wallets = await db.wallet.findMany({
                orderBy: {
                    id: 'desc'
                }
            });
            // Retorna os registros encontrados em formato JSON.
            return NextResponse.json(wallets);
        }
    } catch (error) {
        // Retorna uma resposta de erro caso ocorra uma exceção durante a busca no banco de dados.
        return NextResponse.json({ message: 'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json(error);
    }
}
