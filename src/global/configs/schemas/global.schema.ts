import * as Joi from "joi";

export const globalSchema = {
  DATABASE_HOST: Joi.string().default("localhost").required(),
  DATABASE_PORT: Joi.number().default(5432).required(),
  DATABASE_USERNAME: Joi.string().default("postgres").required(),
  DATABASE_PASSWORD: Joi.string().default("postgres").required(),
  DATABASE_DATABASE: Joi.string().required(),
};
