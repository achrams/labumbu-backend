import * as ProductService from "../services/product.service.js";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const getAllProducts = async (req, reply) => {
  const products = await ProductService.getAll();
  return reply.send(products);
};

export const getProductById = async (req, reply) => {
  const { id } = req.params;
  const product = await ProductService.getById(id);
  if (!product) return reply.code(404).send({ message: "Not found" });
  return reply.send(product);
};

export const createProduct = async (req, reply) => {
  const parts = req.parts();
  const fields = {};
  let imagePath = null;

  for await (const part of parts) {
    if (part.file && part.fieldname !== "image") {
      return reply
        .code(400)
        .send({ message: "Invalid field name for file upload" });
    }
    if (part.file) {
      const ext = path.extname(part.filename);
      const filename = `${fields.name}-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "products", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/products/${filename}`;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const data = {
    name: fields.name,
    image: imagePath,
    shop_url: fields.shop_url,
  };

  const product = await ProductService.create(data);
  if (product) {
    return reply.code(201).send(product);
  } else {
    return reply.code(400).send({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req, reply) => {
  const { id } = req.params;
  const parts = req.parts();
  const fields = {};
  let imagePath = null;

  // Ambil data product lama
  const oldProduct = await ProductService.getById(id);
  if (!oldProduct) {
    return reply.code(404).send({ message: "Product not found" });
  }

  for await (const part of parts) {
    if (part.file) {
      const ext = path.extname(part.filename);
      const filename = `${
        fields.name || oldProduct.name
      }-${randomUUID()}${ext}`;
      const filepath = path.join("uploads", "products", filename);
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/products/${filename}`;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const data = {
    name: fields.name ?? oldProduct.name,
    shop_url: fields.shop_url ?? oldProduct.shop_url,
  };

  if (imagePath) data.image = imagePath;

  // Update DB dulu
  const product = await ProductService.update(id, data);

  // Kalau ada gambar baru & gambar lama ada, hapus yang lama
  if (imagePath && oldProduct.image) {
    const oldFilePath = path.join(
      process.cwd(),
      oldProduct.image.replace(/^\//, "")
    );
    try {
      await fs.unlink(oldFilePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("Gagal hapus file lama:", err);
      }
    }
  }

  return reply.send(product);
};

export const deleteProduct = async (req, reply) => {
  const { id } = req.params;

  // 1. Cari product
  const product = await ProductService.getById(id);
  if (!product) {
    return reply.code(404).send({ message: "Product not found" });
  }

  // 2. Simpan path file (kalau ada)
  let filePath = null;
  if (product.image) {
    filePath = path.join(process.cwd(), product.image.replace(/^\//, ""));
  }

  try {
    // 3. Hapus record di DB
    await ProductService.remove(id);

    // 4. Kalau sukses, hapus file gambarnya
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Gagal menghapus file:", err);
        }
      }
    }

    return reply.code(204).send();
  } catch (err) {
    // 5. Kalau gagal hapus dari DB → file jangan disentuh
    console.error("Gagal hapus product:", err);
    return reply.code(500).send({ message: "Failed to delete product" });
  }
};
