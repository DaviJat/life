/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `data_edicao` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoLocalDinheiro" AS ENUM ('fisico', 'virtual');

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_edicao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalDinheiro" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoLocalDinheiro" NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalDinheiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carteira" (
    "id" SERIAL NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "local_dinheiro_id" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carteira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntradaCarteira" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "local_dinheiro_id" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntradaCarteira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaidaCarteira" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "local_dinheiro_id" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaidaCarteira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContasAPagar" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContasAPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContasAReceber" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_edicao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContasAReceber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Carteira" ADD CONSTRAINT "Carteira_local_dinheiro_id_fkey" FOREIGN KEY ("local_dinheiro_id") REFERENCES "LocalDinheiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaCarteira" ADD CONSTRAINT "EntradaCarteira_local_dinheiro_id_fkey" FOREIGN KEY ("local_dinheiro_id") REFERENCES "LocalDinheiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaidaCarteira" ADD CONSTRAINT "SaidaCarteira_local_dinheiro_id_fkey" FOREIGN KEY ("local_dinheiro_id") REFERENCES "LocalDinheiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContasAPagar" ADD CONSTRAINT "ContasAPagar_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContasAReceber" ADD CONSTRAINT "ContasAReceber_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
