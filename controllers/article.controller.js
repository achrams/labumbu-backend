import * as ArticleService from "../services/article.service.js";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const getAllArticles = async (req, reply) => {
  const articles = await ArticleService.getAll();
  return reply.send(articles);
};

export const getArticleById = async (req, reply) => {
  const { id } = req.params;
  const article = await ArticleService.getById(id);
  if (!article) return reply.code(404).send({ message: "Not found" });
  return reply.send(article);
};

export const createArticle = async (req, reply) => {
  const parts = req.parts(); // untuk form-data (butuh fastify-multipart)
  const fields = {};
  let imagePath = null;
  let optImgPath = null;

  for await (const part of parts) {
    if (part.file) {
      console.log(part.filename);
      const ext = path.extname(part.filename);
      const filename = `article-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "articles", filename);
      const buffer = await part.toBuffer();

      await fs.writeFile(filepath, buffer);

      if (part.fieldname === "image") {
        imagePath = `/uploads/articles/${filename}`;
      } else if (part.fieldname === "optImg") {
        optImgPath = `/uploads/articles/${filename}`;
      }
    } else {
      fields[part.fieldname] = part.value;
    }
  }
  const contents = JSON.parse(fields.contents || "[]");
  const specialities = JSON.parse(fields.specialities || "[]");
  const recommendedRecipes = { connect: [] };
  const recommendedProducts = { connect: [] };
  const splitted = fields.recommendedRecipes
    ? fields.recommendedRecipes.split(",")
    : [];
  if (splitted.length > 0) {
    for (const recipeId of splitted) {
      recommendedRecipes.connect.push({ id: +recipeId });
    }
  }
  if (fields.recommendedProducts)
    recommendedProducts.connect.push({ id: +fields.recommendedProducts });

  const created = await ArticleService.create({
    title: fields.title,
    image: imagePath,
    optImg: optImgPath,
    approvedBy: fields.approvedBy,
    recommendedRecipes: recommendedRecipes || [],
    recommendedProducts: recommendedProducts || [],
    contents,
    specialities,
  });

  if (!created) {
    return reply.code(400).send({ message: "Failed to create article" });
  }

  return reply.code(201).send({
    title: fields.title,
    image: imagePath,
    optImg: optImgPath,
    approvedBy: fields.approvedBy,
    recommendedRecipes: recommendedRecipes,
    recommendedProducts: recommendedProducts,
    contents,
    specialities,
  });
};

export const updateArticle = async (req, reply) => {
  const { id } = req.params;
  const parts = req.parts();
  const fields = {};
  let imagePath = null;
  let optImgPath = null;

  for await (const part of parts) {
    if (part.file) {
      const ext = path.extname(part.filename);
      const filename = `article-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "articles", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);

      if (part.fieldname === "image") {
        imagePath = `/uploads/articles/${filename}`;
      } else if (part.fieldname === "optImg") {
        optImgPath = `/uploads/articles/${filename}`;
      }
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const recommendedRecipes = { connect: [] };
  const recommendedProducts = { connect: [] };
  const splitted = fields.recommendedRecipes
    ? fields.recommendedRecipes.split(",")
    : [];
  if (splitted.length > 0) {
    for (const recipeId of splitted) {
      recommendedRecipes.connect.push({ id: +recipeId });
    }
  }
  if (fields.recommendedProducts)
    recommendedProducts.connect.push({ id: +fields.recommendedProducts });

  const updateData = {
    title: fields.title,
    approvedBy: fields.approvedBy,
    contents: JSON.parse(fields.contents || "[]"),
    specialities: JSON.parse(fields.specialities || "[]"),
    recommendedRecipes: recommendedRecipes,
    recommendedProducts: recommendedProducts,
  };

  // Tambahkan file path jika ada file baru
  if (imagePath) updateData.image = imagePath;
  if (optImgPath) updateData.optImg = optImgPath;

  const updatedArticle = await ArticleService.update(id, updateData);
  return reply.send(updatedArticle);
};

export const deleteArticle = async (req, reply) => {
  const { id } = req.params;
  await ArticleService.remove(id);
  return reply.code(204).send();
};
