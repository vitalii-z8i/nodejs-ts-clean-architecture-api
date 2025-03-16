import Joi from "joi";
import JOIValidator from "../validator";

const createValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').required(),
});

export default new JOIValidator(createValidator);
