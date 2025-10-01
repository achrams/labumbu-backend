/*
  Warnings:

  - Added the required column `slug` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "video" TEXT NOT NULL;
