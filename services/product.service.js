import { ProductModel } from "../models/product.model.js";

export const getAll = async () => {
  return await ProductModel.findAll();
};

export const getById = async (id) => {
  return await ProductModel.findById(id);
};

export const create = async (data) => {
  return await ProductModel.create(data);
};

export const update = async (id, data) => {
  return await ProductModel.update(id, data);
};

export const remove = async (id) => {
  return await ProductModel.delete(id);
};
