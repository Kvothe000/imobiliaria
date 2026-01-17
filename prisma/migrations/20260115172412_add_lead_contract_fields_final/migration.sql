-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "nationality" TEXT DEFAULT 'Brasileiro',
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "rg" TEXT;
