import { RecipeModel } from "../models/recipe.model.js";

export const getAll = async () => {
  return await RecipeModel.findAll();
};

export const getById = async (id) => {
  return await RecipeModel.findById(id);
};

export const create = async (data) => {
  return await RecipeModel.create(data);
};

export const update = async (id, data) => {
  return await RecipeModel.update(id, data);
};

export const remove = async (id) => {
  return await RecipeModel.delete(id);
};
