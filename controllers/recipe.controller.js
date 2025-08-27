import * as RecipeService from "../services/recipe.service.js";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const getAllRecipes = async (req, reply) => {
  const recipes = await RecipeService.getAll();
  return reply.send(recipes);
};

export const getRecipeById = async (req, reply) => {
  const { id } = req.params;
  const recipe = await RecipeService.getById(id);
  if (!recipe) return reply.code(404).send({ message: "Not found" });
  return reply.send(recipe);
};

export const createRecipe = async (req, reply) => {
  const parts = req.parts();
  const fields = {};
  let imagePath = null;

  for await (const part of parts) {
    if (part.file) {
      const ext = path.extname(part.filename);
      const filename = `recipe-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "recipes", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/recipes/${filename}`;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const recommendedProducts = {
    connect: [],
  };

  if (fields.recommendedProducts) {
    const rec = JSON.parse(fields.recommendedProducts);
    rec.forEach((el) => {
      recommendedProducts.connect.push({ id: +el });
    });
  }

  const data = {
    title: fields.title,
    description: fields.description,
    instructions: fields.instructions,
    ingredients: fields.ingredients.split(","),
    utensils: fields.utensils.split(","),
    image: imagePath,
    video: fields.video,
    categoryId: +fields.category,
    recommendedProducts: recommendedProducts,
  };

  const recipe = await RecipeService.create(data);
  return reply.code(201).send(recipe);
};

export const updateRecipe = async (req, reply) => {
  console.log("Updating recipe...");
  const { id } = req.params;
  const parts = req.parts();
  const fields = {};
  let imagePath = null;
  const recommendedProducts = {
    connect: [],
  };

  const oldRecipe = await RecipeService.getById(id);

  for await (const part of parts) {
    if (part.file) {
      if (oldRecipe?.image) {
        const oldFilePath = path.join(process.cwd(), oldRecipe.image);
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.error("Gagal hapus gambar lama:", err.message);
        }
      }
      const ext = path.extname(part.filename);
      const filename = `${fields.title}-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "recipes", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/recipes/${filename}`;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  if (fields.recommendedProducts) {
    const rec = fields.recommendedProducts.split(",");
    rec.forEach((el) => {
      recommendedProducts.connect.push({ id: +el });
    });
  }

  const data = {
    title: fields.title,
    description: fields.description,
    instructions: fields.instructions,
    ingredients: fields.ingredients.split(","),
    utensils: fields.utensils.split(","),
    video: fields.video,
    categoryId: +fields.category,
    recommendedProducts,
  };

  if (imagePath) data.image = imagePath;

  const recipe = await RecipeService.update(id, data);

  console.log("ini resep", recipe);
  return reply.send(recipe);
};

export const deleteRecipe = async (req, reply) => {
  const { id } = req.params;

  // Ambil data lama dulu
  const recipe = await RecipeService.getById(id);

  if (recipe?.image) {
    const oldFilePath = path.join(process.cwd(), recipe.image);
    try {
      await fs.unlink(oldFilePath);
    } catch (err) {
      console.error("Gagal hapus gambar:", err.message);
    }
  }

  await RecipeService.remove(id);
  return reply.code(204).send();
};
