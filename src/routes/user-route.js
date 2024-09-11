import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import { uploadProfile } from "../middleware/multer-middleware.js";
// import taskController from "../controller/task-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//User API
userRouter.patch("/api/user", userController.update);
userRouter.patch("/api/user/password", userController.changePassword);

//profile API
userRouter.get("/api/profile", userController.get);
userRouter.patch("/api/profile/username", userController.changeUsername);
userRouter.patch("/api/profile", userController.update);
userRouter.patch(
  "/api/profile/photo",
  uploadProfile.single("photo"),
  userController.changePhotoProfile
);
export { userRouter };
