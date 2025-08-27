import { ArticleModel } from "../models/article.model.js";

export const getAll = async () => {
  return await ArticleModel.findAll();
};

export const getById = async (id) => {
  return await ArticleModel.findById(id);
};

export const create = async (data) => {
  return await ArticleModel.create(data);
};

export const update = async (id, data) => {
  return await ArticleModel.update(id, data);
};

export const remove = async (id) => {
  return await ArticleModel.delete(id);
};
