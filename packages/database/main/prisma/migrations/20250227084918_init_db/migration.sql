-- CreateEnum
CREATE TYPE "Category" AS ENUM ('KINKY_KITTENS', 'TABBY_TEASES', 'FELINE_FETISH', 'SULTRY_STRAYS', 'WHISKER_WONDERS');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileUploadingId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUploading" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileUploading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "imageId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "Category"[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostDislike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostDislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePictureId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCathub" BOOLEAN NOT NULL DEFAULT false,
    "sex" "Sex",
    "description" TEXT,
    "price" INTEGER,
    "age" INTEGER,
    "location" geography(Point, 4326),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileUploadingId_key" ON "File"("fileUploadingId");

-- CreateIndex
CREATE UNIQUE INDEX "FileUploading_key_key" ON "FileUploading"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Post_imageId_key" ON "Post"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "PostDislike_userId_postId_key" ON "PostDislike"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "User"("profilePictureId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fileUploadingId_fkey" FOREIGN KEY ("fileUploadingId") REFERENCES "FileUploading"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUploading" ADD CONSTRAINT "FileUploading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDislike" ADD CONSTRAINT "PostDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDislike" ADD CONSTRAINT "PostDislike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
