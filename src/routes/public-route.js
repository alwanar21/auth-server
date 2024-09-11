import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();

//auth API
publicRouter.post("/api/register", userController.register);
publicRouter.post("/api/login", userController.login);
publicRouter.post("/api/refresh", userController.refresh);

// publicRouter.post("/api/user/password", userController.resetPassword);
// publicRouter.get("/api/email", userController.emailVerification);

export { publicRouter };
