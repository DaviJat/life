// Este arquivo define as opções de autenticação para o NextAuth.js.
// Ele configura como o NextAuth.js lidará com a autenticação de usuários.

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import db from "./db"

// Definição das opções de autenticação
const authOptions: NextAuthOptions = {
    // Configuração do adaptador para o NextAuth usar o Prisma como fonte de dados
    adapter: PrismaAdapter(db),
    // Chave secreta para assinar tokens de sessão
    secret: process.env.NEXTAUTH_SECRET,
    // Configuração da sessão
    session: {
        strategy: 'jwt' // Significa que a sessão do usuário será armazenada como um JWT (JSON Web Token) 
        // criptografado (JWE) e armazenado no cookie de sessão.
    },
    // Especificar URLs a serem usados se você deseja criar páginas personalizadas de login, saída e erro.
    pages: {
        signIn: '/sign-in',
    },
    // Configuração dos provedores de autenticação
    providers: [
        // Provedor de credenciais (email e senha)
        CredentialsProvider({
            // O nome a ser exibido no formulário de login (por exemplo, 'Entrar com...')
            name: 'Credentials',
            // As credenciais são usadas para gerar um formulário adequado na página de login.
            // Você pode especificar quaisquer campos que espera serem enviados.
            // Por exemplo, domínio, nome de usuário, senha, token de autenticação de dois fatores, etc.
            // Você pode passar qualquer atributo HTML para a tag <input> por meio do objeto.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" }, // Campo de email
                password: { label: "Password", type: "password" } // Campo de senha
            },
            // Função de autorização para autenticar usuários com email e senha
            async authorize(credentials) {
                // Verifica se o email e a senha foram fornecidos corretamente.
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Procura um usuário existente no banco de dados com o email fornecido.
                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })
                if (!existingUser) {
                    return null
                }

                // Compara a senha fornecida com a senha armazenada do usuário.
                const passwordMatch = await compare(credentials.password, existingUser.password);
                if (!passwordMatch) {
                    return null;
                }

                // Se as credenciais forem válidas, retorna um objeto contendo o ID, nome de usuário e email do usuário autenticado.
                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                    email: existingUser.email
                }
            }

        })
    ],
    // Callbacks assíncronos para manipular tokens e sessões, controlando o comportamento durante a execução de ações específicas.
    callbacks: {
        // Callback para manipular o token JWT
        async jwt({ token, user }) {
            // Se um usuário estiver autenticado (logado)
            if (user) {
                // Adiciona o nome de usuário ao token JWT
                return {
                    ...token,
                    username: user.username,
                    id: user.id
                }
            }
            // Retorna o token JWT sem modificações
            return token
        },
        // Callback para manipular a sessão do usuário
        async session({ session, user, token }) {
            // Atualiza a sessão do usuário com o nome de usuário do token JWT
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username
                }
            }
        }
    }

}

export default authOptions; // Exporta as opções de autenticação

// O padrão é "jwt", mas se estiver usando um adapter, o padrão será alterado para "database".
// Isso significa que a sessão do usuário será armazenada no banco de dados em vez de ser diretamente no cookie.

// Você ainda pode forçar explicitamente uma sessão JWT definindo "jwt".

// Quando você opta por "database", o cookie de sessão conterá apenas um valor sessionToken,
// que é usado para buscar a sessão no banco de dados.

// Considerações adicionais: https://prnt.sc/gREQzGbm11T_