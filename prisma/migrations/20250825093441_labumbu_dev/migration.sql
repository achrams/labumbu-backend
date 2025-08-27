-- CreateTable
CREATE TABLE "public"."_RecipeProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeProduct_B_index" ON "public"."_RecipeProduct"("B");

-- AddForeignKey
ALTER TABLE "public"."_RecipeProduct" ADD CONSTRAINT "_RecipeProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeProduct" ADD CONSTRAINT "_RecipeProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
