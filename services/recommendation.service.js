import { RecommendationModel } from "../models/recommendation.model.js";

export const getAll = async () => {
  return await RecommendationModel.findAll();
};

export const create = async (data) => {
  return await RecommendationModel.create(data);
};

export const update = async (id, data) => {
  return await RecommendationModel.update(id, data);
};

export const remove = async (id) => {
  return await RecommendationModel.delete(id);
};
