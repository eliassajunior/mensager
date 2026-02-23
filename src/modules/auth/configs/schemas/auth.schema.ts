import * as Joi from "joi";

export const authSchema = {
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().default(86400),
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
};
