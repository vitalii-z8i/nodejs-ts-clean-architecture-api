import Joi from "joi";
import JOIValidator from "../validator";

const registerValidator = Joi.object({
  firstName: Joi.string().required(),
	lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
});

export default new JOIValidator(registerValidator);
