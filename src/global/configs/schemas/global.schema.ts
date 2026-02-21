import * as Joi from "joi";

export const globalSchema = {
  DATABASE_HOST: Joi.string().default("localhost"),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().default("postgres"),
  DATABASE_PASSWORD: Joi.string().default("postgres"),
  DATABASE_DATABASE: Joi.string().required(),
};
