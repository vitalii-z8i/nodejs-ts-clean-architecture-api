import Joi from "joi";
import JOIValidator from "../validator";

const registerValidator = Joi.object({
  firstName: Joi.string().required(),
	lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({
    messages: {
      'any.required': 'password confirmation is required',
      'any.only': 'must match password'
    }
  }),
});

export default new JOIValidator(registerValidator);
