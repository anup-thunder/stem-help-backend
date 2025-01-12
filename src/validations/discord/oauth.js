import Joi from "joi";

const token = (value, helpers) => {
  // TODO: I'm not sure if this is the correct regex, but its from observation
  if (!value.match(/^[\da-zA-Z_-]{20,}$/)) {
    return helpers.message(`"{{#label}}" must be a valid token`);
  }
  return value;
};

export { token };
