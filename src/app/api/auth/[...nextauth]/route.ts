// Este arquivo instrui o NextAuth.js a tratar cada solicitação de API começando com /api/auth/* 
// com o código neste arquivo [...nextauth].

import NextAuth from "next-auth/next";

import authOptions from "@/lib/auth";

// Cria um handler usando NextAuth e passa as opções de autenticação sendo usado para lidar com 
// solicitações GET e POST para a rota de API "/api/auth/[...nextauth]".
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// No Next.js, você pode definir uma rota de API que captura todas as solicitações iniciadas com um determinado caminho.