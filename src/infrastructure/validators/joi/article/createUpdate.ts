import Joi from "joi";
import JOIValidator from "../validator";

const articleValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  content: Joi.string().required(),
  isPublished: Joi.boolean().allow(0, 1).optional(),
});

export default new JOIValidator(articleValidator);
