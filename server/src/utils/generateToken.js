import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                  // payload
    process.env.JWT_SECRET,        // secret key (set in .env)
    { expiresIn: "7d" }            // 7 days expiry
  );
};

export default generateToken;
