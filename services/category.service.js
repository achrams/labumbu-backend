import { CategoryModel } from "../models/category.model.js";

export const getAll = async () => {
  return await CategoryModel.findAll();
};

export const create = async (data) => {
  return await CategoryModel.create(data);
};

export const update = async (id, data) => {
  return await CategoryModel.update(id, data);
};

export const remove = async (id) => {
  return await CategoryModel.delete(id);
};
