import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorised"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }
    if (req.params.adminId != user.id) {
      console.log(req.params.adminId, "userID : ",user.id)
      return next(
        errorHandler(401, "You are not authorised use this account.")
      );
    }
    req.admin = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  const token = req.cookies.enteBuddy_access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorised"));
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }
      req.user = user.userInfo;
      if (req.params.userId != req.user._id) {
        return next(
          errorHandler(401, "You are not authorised use this account.")
        );
      }
    });
  }
  next();
};
