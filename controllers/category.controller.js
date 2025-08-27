import * as CategoryService from "../services/category.service.js";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const getAllCategories = async (req, reply) => {
  const categories = await CategoryService.getAll();
  return reply.send(categories);
};

export const getCategoryById = async (req, reply) => {
  const { id } = req.params;
  const category = await CategoryService.getById(id);
  if (!category) return reply.code(404).send({ message: "Not found" });
  return reply.send(category);
};

export const createCategory = async (req, reply) => {
  const parts = req.parts();
  const fields = {};
  let imagePath = null;

  for await (const part of parts) {
    if (part.file) {
      const ext = path.extname(part.filename);
      const filename = `category-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "categories", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/categories/${filename}`;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const category = await CategoryService.create({
    name: fields.name,
    image: imagePath,
  });
  return reply.code(201).send(category);
};

export const updateCategory = async (req, reply) => {
  const { id } = req.params;
  const cat = await CategoryService.getById(id);

  if (cat) {
    const parts = req.parts();
    const fields = {};
    let imagePath = null;

    for await (const part of parts) {
      if (part.file) {
        const ext = path.extname(part.filename);
        const filename = `recipe-${randomUUID()}${ext}`;
        const filepath = path.join("uploads", "categories", filename);
        const buffer = await part.toBuffer();
        await fs.writeFile(filepath, buffer);
        imagePath = `/uploads/categories/${filename}`;
      } else {
        fields[part.fieldname] = part.value;
      }
    }
    const category = await CategoryService.update(id, {
      name: fields.name,
      image: imagePath,
    });
    return reply.send(category);
  } else {
    return reply.code(404).send({ message: "Category not found" });
  }
};

export const deleteCategory = async (req, reply) => {
  const { id } = req.params;
  await CategoryService.remove(id);
  return reply.code(204).send();
};
