import path from "path";
import fs from "fs/promises"; // Menggunakan fs/promises untuk operasi asinkron

export const deleteFile = async (filename) => {
  const filePath = path.join("public/profile", filename);
  await fs.unlink(filePath);
};
