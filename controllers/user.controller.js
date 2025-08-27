import * as AuthService from "../services/user.service.js";

export const register = async (req, reply) => {
  try {
    const user = await AuthService.registerUser(req.body);
    return reply.code(201).send({ message: "User created", user });
  } catch (err) {
    return reply.code(400).send({ message: err.message });
  }
};

export const login = async (req, reply) => {
  console.log(req.parts);
  try {
    const result = await AuthService.loginUser(req.body);
    return reply.send(result);
  } catch (err) {
    return reply.code(401).send({ message: err.message });
  }
};
