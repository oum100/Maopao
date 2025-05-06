/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialNumber` on the `TestRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[macAddress]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Device` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `status` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `TestRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('INSTOCK', 'ACTIVATED', 'REGISTERED');

-- DropForeignKey
ALTER TABLE "TestRecord" DROP CONSTRAINT "TestRecord_serialNumber_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "macAddress" TEXT,
ADD COLUMN     "status" "DeviceStatus" NOT NULL,
ALTER COLUMN "serialNumber" DROP NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TestRecord" DROP COLUMN "serialNumber",
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "deviceRecId" INTEGER,
ADD COLUMN     "pageId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "provider" TEXT DEFAULT 'credentials',
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "appKey" DROP NOT NULL,
ALTER COLUMN "appSecret" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "ownerUuid" TEXT,
    "image" TEXT,
    "fullName" TEXT,
    "lastName" TEXT,
    "mobile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_ownerUuid_key" ON "Profile"("ownerUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Device_macAddress_key" ON "Device"("macAddress");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRecord" ADD CONSTRAINT "TestRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
