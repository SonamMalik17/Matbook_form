import Joi from 'joi';

const buildFieldSchema = (field) => {
  switch (field.type) {
    case 'text':
    case 'textarea': {
      let schema = Joi.string();
      if (field.validations?.minLength) schema = schema.min(field.validations.minLength);
      if (field.validations?.maxLength) schema = schema.max(field.validations.maxLength);
      if (field.validations?.regex) schema = schema.pattern(new RegExp(field.validations.regex));
      return field.required ? schema.required() : schema.allow('', null);
    }
    case 'number': {
      let schema = Joi.number();
      if (field.validations?.min !== undefined) schema = schema.min(field.validations.min);
      if (field.validations?.max !== undefined) schema = schema.max(field.validations.max);
      return field.required ? schema.required() : schema.allow(null);
    }
    case 'select': {
      const values = field.options?.map((o) => o.value) ?? [];
      let schema = Joi.string().valid(...values);
      return field.required ? schema.required() : schema.allow('', null);
    }
    case 'multi-select': {
      const values = field.options?.map((o) => o.value) ?? [];
      let schema = Joi.array().items(Joi.string().valid(...values));
      if (field.validations?.minSelected) schema = schema.min(field.validations.minSelected);
      if (field.validations?.maxSelected) schema = schema.max(field.validations.maxSelected);
      return field.required ? schema.required() : schema.allow(null);
    }
    case 'date': {
      let schema = Joi.date();
      if (field.validations?.minDate) schema = schema.min(field.validations.minDate);
      return field.required ? schema.required() : schema.allow(null);
    }
    case 'switch': {
      const schema = Joi.boolean();
      return field.required ? schema.required() : schema.allow(null);
    }
    default:
      return Joi.any();
  }
};

const buildSchema = (formSchema) => {
  const shape = {};
  formSchema.fields.forEach((field) => {
    shape[field.id] = buildFieldSchema(field);
  });
  return Joi.object(shape).options({ abortEarly: false });
};

export const ValidationService = {
  validateAgainstSchema(schema, payload) {
    const joiSchema = buildSchema(schema);
    const { error } = joiSchema.validate(payload);
    if (!error) return {};
    return error.details.reduce((acc, detail) => {
      const key = detail.path[0];
      if (key) acc[key] = detail.message.replace(/["]/g, '');
      return acc;
    }, {});
  }
};
