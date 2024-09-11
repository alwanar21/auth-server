import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { publicRouter } from "./routes/public-route.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { userRouter } from "./routes/user-route.js";
import { notFoundMiddleware } from "./middleware/notFound-middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/images", express.static("public/profile"));
app.use(publicRouter);
app.use(userRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Auth app listening on port ${port}`);
});
