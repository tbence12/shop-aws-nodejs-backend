import * as Joi from 'joi';

const productSchema = Joi.object().keys({
  description: Joi.string().required(),
  id: Joi.string().required(),
  price: Joi.number().required(),
  title: Joi.string().required(),
  count: Joi.number().required()
});

function schemaValidator(schema, body) {
  const { error } = schema.validate(body);

  let validationResult;

  if (error?.isJoi) {
    validationResult = {
      valid: false,
      message: error.message
    };
  } else {
    validationResult = {
      valid: true,
      body
    };
  }

  return validationResult;
}

const productValidator = (body) =>  schemaValidator(productSchema, body);

export { productValidator };
