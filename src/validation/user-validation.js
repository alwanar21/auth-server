import Joi from "joi";

const registerUserValidation = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(10).required(),
  password: Joi.string().min(8).max(100).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])")).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match with password",
  }),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().max(100).required(),
});

const changePasswordUserValidation = Joi.object({
  currentPassword: Joi.string().max(100).required(),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])"))
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password does not match with password",
  }),
});

const changeUsernameValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "\"username\" should be a type of 'text'",
    "string.alphanum": '"username" should only contain alphanumeric characters',
    "string.empty": '"username" cannot be empty',
    "string.min": '"username" should have a minimum length of {#limit}',
    "string.max": '"username" should have a maximum length of {#limit}',
    "any.required": '"username" is required',
  }),
});

const updateProfileValidation = Joi.object({
  firstName: Joi.string().min(1).max(50).messages({
    "string.base": "\"firstname\" should be a type of 'text'",
    "string.empty": '"firstname" cannot be empty',
    "string.min": '"firstname" should have a minimum length of {#limit}',
    "string.max": '"firstname" should have a maximum length of {#limit}',
    "any.required": '"firstname" is required',
  }),

  lastName: Joi.string().min(1).max(50).messages({
    "string.base": "\"lastname\" should be a type of 'text'",
    "string.empty": '"lastname" cannot be empty',
    "string.min": '"lastname" should have a minimum length of {#limit}',
    "string.max": '"lastname" should have a maximum length of {#limit}',
    "any.required": '"lastname" is required',
  }),

  birthDate: Joi.date().less("now").messages({
    "date.base": '"birthdate" should be a valid date',
    "date.less": '"birthdate" must be in the past',
    "any.required": '"birthdate" is required',
  }),
});

export {
  registerUserValidation,
  loginUserValidation,
  updateProfileValidation,
  changePasswordUserValidation,
  changeUsernameValidation,
};
