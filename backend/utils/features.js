import jwt from "jsonwebtoken";
import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

export const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};

export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const success = (res, message = "Success", statusCode = 200, data = []) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    return next(error);
  }
};

export const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res.status(code).cookie("insta-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

