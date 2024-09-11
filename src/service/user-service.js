import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
import dotenv from "dotenv";
import {
  changePasswordUserValidation,
  changeUsernameValidation,
  loginUserValidation,
  registerUserValidation,
  updateProfileValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { deleteFile } from "../utils/delete.js";
dotenv.config();

const register = async (request) => {
  const user = await validate(registerUserValidation, request);
  const existingUser = await prismaClient.profile.findFirst({
    where: {
      OR: [{ email: user.email }, { username: user.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === user.email) {
      throw new ResponseError(400, "Email is already in use");
    }
    if (existingUser.username === user.username) {
      throw new ResponseError(400, "Username is already in use");
    }
  }

  user.password = await hashPassword(user.password);
  const { confirmPassword, username, ...restDataUser } = user;
  return prismaClient.user.create({
    data: {
      ...restDataUser,
      profile: {
        create: {
          username: username,
        },
      },
    },
    select: {
      email: true,
      isActive: true,
      profile: {
        select: {
          username: true,
          lastName: true,
          birthDate: true,
        },
      },
    },
  });
};

const login = async (request) => {
  const loginRequest = await validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
      isActive: true,
      profile: {
        select: {
          username: true,
        },
      },
    },
  });
  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = await validatePassword(loginRequest.password, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong!!");
  }

  let accessToken = generateToken({ email: user.email, username: user.profile.username });

  let refreshToken = generateToken(
    { email: user.email, username: user.profile.username },
    "refreshToken"
  );

  return {
    accessToken,
    refreshToken,
    data: {
      email: user.email,
      username: user.profile.username,
    },
  };
};

const refresh = async (token) => {
  const decoded = verifyToken(token, "refreshtoken");

  const user = await prismaClient.user.findUnique({
    where: {
      email: decoded.email,
    },
    select: {
      email: true,
      password: true,
      isActive: true,
      profile: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  let accessToken = generateToken({ email: user.email, username: user.profile.username });

  let refreshToken = generateToken(
    { email: user.email, username: user.profile.username },
    "refreshToken"
  );

  return {
    accessToken,
    refreshToken,
  };
};

const get = async (email) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      isActive: true,
      profile: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return user;
};

const update = async (request) => {
  const username = request.user.username;

  const updateProfile = validate(updateProfileValidation, request.body);

  if (!updateProfile || Object.keys(updateProfile).length === 0) {
    throw new ResponseError(400, "No data provided for update.");
  }

  const updatedTask = await prismaClient.profile.update({
    where: {
      username,
    },
    data: updateProfile,
  });

  return {
    message: `Profile updated successfully`,
    data: updatedTask,
  };
};

const changePassword = async (request) => {
  const email = request.user.email;
  const changeRequest = await validate(changePasswordUserValidation, request.body);
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  const isPasswordValid = await bcrypt.compare(changeRequest.currentPassword, user.password);
  if (!isPasswordValid) {
    // Create a custom validation error
    const passwordError = [
      {
        message: '"currentPassword" is incorrect',
        path: ["currentPassword"],
        type: "password.mismatch",
        context: {
          label: "currentPassword",
          key: "currentPassword",
        },
      },
    ];

    throw new ResponseError(400, "Bad Request", passwordError);
  }

  changeRequest.newPassword = await bcrypt.hash(changeRequest.newPassword, 10);

  await prismaClient.user.update({
    where: {
      email: email,
    },
    data: {
      password: changeRequest.newPassword,
    },
  });

  return {
    message: `Password updated successfully`,
  };
};

const changeUsername = async (request) => {
  const email = request.user.email;
  const changeRequest = await validate(changeUsernameValidation, request.body);
  const user = await prismaClient.profile.findUnique({
    where: {
      username: changeRequest.username,
    },
  });

  if (user && user.email == email) {
    throw new ResponseError(404, "Username cannot be the same");
  } else if (user && user.email !== email) {
    throw new ResponseError(404, "Username is not available");
  }

  await prismaClient.profile.update({
    where: {
      email: email,
    },
    data: {
      username: changeRequest.username,
    },
  });

  return {
    message: `username updated successfully`,
  };
};

const changeProfilePicture = async (request) => {
  const email = request.user.email;
  const user = await prismaClient.profile.findUnique({
    where: {
      email: email,
    },
  });
  // console.log(user, "user");
  // console.log(request.file, "reqfile");

  if (user.photo) {
    await deleteFile(user.photo);
  }

  await prismaClient.profile.update({
    where: {
      email: email,
    },
    data: {
      photo: request.file.filename,
    },
  });

  return {
    message: `profile picture updated successfully`,
  };
};

export default {
  register,
  login,
  refresh,
  get,
  update,
  changePassword,
  changeUsername,
  changeProfilePicture,
};
