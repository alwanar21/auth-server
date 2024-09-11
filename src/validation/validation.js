import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    // allowUnknown: false,
    stripUnknown: true, //key value object yang tidak ada di validasi dianggap tidak ada
  });

  if (result.error) {
    throw new ResponseError(400, "Bad Request", result.error.details);
  } else {
    return result.value;
  }
};

export { validate };
