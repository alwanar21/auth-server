import bcrypt from "bcrypt";

async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function validatePassword(hashedPassword, inputPassword) {
  const isPasswordValid = await bcrypt.compare(hashedPassword, inputPassword);
  return isPasswordValid;
}

export { hashPassword, validatePassword };
