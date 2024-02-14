// Este arquivo configura e exporta uma instância do cliente Prisma para acesso aos dados do banco de dados em todo o aplicativo.
// Além disso, declara uma variável global para facilitar o acesso à instância do Prisma em todo o código, 
// centralizando o gerenciamento da conexão com o banco de dados.

import { PrismaClient } from '@prisma/client'

// Função que retorna uma instância única do cliente Prisma.
const prismaClientSingleton = () => {
    return new PrismaClient()
}

// Declaração global para garantir que a instância do Prisma seja acessível em todo o aplicativo.
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Inicialização da instância do Prisma usando a declaração global ou criando uma nova instância.
const prisma = globalThis.prisma ?? prismaClientSingleton()

// Exporta a instância do Prisma para ser utilizada em outros módulos.
export default prisma

// Salva a instância do Prisma como uma variável global para acesso durante o desenvolvimento.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
