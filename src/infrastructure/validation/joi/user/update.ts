import Joi from 'joi'
import JOIValidator from '../validator'

const updateValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.when(Joi.ref('password'), {
    is: Joi.required(),
    then: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({
        messages: {
          'any.required': 'password confirmation is required',
          'any.only': 'must match password',
        },
      }),
    otherwise: Joi.forbidden(),
  }),
})

export default new JOIValidator(updateValidator)
