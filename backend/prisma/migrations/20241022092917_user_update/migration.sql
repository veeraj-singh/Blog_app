-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "degree" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "twitter" TEXT;
