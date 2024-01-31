import "next-auth";

declare module "next-auth" {
    interface User {
        id: number;
        email: string;
        nome: string;
        sobrenome: string;
    }

    interface Session {
        user: User & {
            nome: string;
        }
        token: {
            nome: string;
        }
    }
}
