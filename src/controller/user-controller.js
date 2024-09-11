import { uploadProfile } from "../middleware/multer-middleware.js";
import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const result = await userService.refresh(token);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const email = req.user.email;
    const result = await userService.get(email);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await userService.update(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const changeUsername = async (req, res, next) => {
  try {
    const result = await userService.changeUsername(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const changePhotoProfile = async (req, res, next) => {
  try {
    const result = await userService.changeProfilePicture(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  refresh,
  get,
  update,
  changePassword,
  changeUsername,
  changePhotoProfile,
};
