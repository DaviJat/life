import { NextRequest, NextResponse } from 'next/server';

import db from '@/lib/db';

// Função assíncrona para lidar com requisições GET.
export default async function GET(request: NextRequest) {
  // Obtém o parâmetro 'id' da URL da requisição.
  const id = request.nextUrl.searchParams.get('id');
  try {
    if (id) {
      // Busca um registro de billsToPay pelo id no banco de dados.
      const billsToPay = await db.billsToPay.findUnique({
        where: {
          id: parseInt(id, 10)
        }
      });

      // Retorna o registro encontrado em formato JSON.
      return NextResponse.json(billsToPay);
    }
    // Se não houver 'id' na URL, busca todos os registros de billsToPay no banco de dados.
    const billsToPay = await db.billsToPay.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    // Retorna os registros encontrados em formato JSON.
    return NextResponse.json(billsToPay);
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra uma exceção durante a busca no banco de dados.
    return NextResponse.json(
      {
        message:
          'Ops! Houve um problema durante a operação. Por favor, tente novamente mais tarde'
      },
      { status: 500 }
    );
  }
}
