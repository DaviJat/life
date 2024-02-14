// Este arquivo estende o comportamento padrão do NextAuth, adicionando propriedades à interface User e Session.

// Importa o módulo "next-auth"
import "next-auth"

// Declaração do módulo para extender os objetos User e Session do NextAuth
declare module "next-auth" {

    // Substitui a estrutura do objeto User padrão do NextAuth
    interface User {
        username: string
    }
    // Substitui a estrutura do objeto Session que para conter as informações do usuário e do token
    interface Session {
        user: User
        token: {
            username: string
        }
    }
}

// Session é retornado por useSession, getSession e recebido como uma propriedade no SessionProvider do React Context.

// A interface User define a estrutura dos objetos de usuário retornados em diferentes contextos, como nos retornos de
// chamada dos provedores OAuth ou ao usar um banco de dados para armazenar as sessões.
