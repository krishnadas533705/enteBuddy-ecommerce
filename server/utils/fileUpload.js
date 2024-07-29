import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "primaryImage") {
      cb(
        null,
        "/var/www/enteBuddy-ecommerce/server/Public/uploads/primaryImages"
      );
    } else if (file.fieldname == "secondaryImages") {
      cb(
        null,
        "/var/www/enteBuddy-ecommerce/server/Public/uploads/secondaryImages"
      );
    } else if (file.fieldname == "bannerImage") {
      cb(
        null,
        "/var/www/enteBuddy-ecommerce/server/Public/uploads/bannerImages"
      );
    } else if (file.fieldname == "icons") {
      cb(null, "/var/www/enteBuddy-ecommerce/server/Public/uploads/icons");
    } else {
      cb(new Error("Unexpected field"));
    }

    //   if (file.fieldname == "primaryImage") {
    //   cb(null,"C:/Users/ASWIN/Documents/KD/enteBuddy-ecommerce/server/Public/uploads/primaryImages");
    // } else if (file.fieldname == "secondaryImages") {
    //   cb(null, "C:/Users/ASWIN/Documents/KD/enteBuddy-ecommerce/server/Public/uploads/secondaryImages");
    // } else if (file.fieldname == "bannerImage") {
    //   cb(null, "C:/Users/ASWIN/Documents/KD/enteBuddy-ecommerce/server/Public/uploads/bannerImages");

    // } else if(file.fieldname == 'icons'){
    //   cb(null, "C:/Users/ASWIN/Documents/KD/enteBuddy-ecommerce/server/Public/uploads/icons");
    // }
    // else {
    //   cb(new Error("Unexpected field"));
    // }
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

export const imageUpload = multer({ storage: storage }).fields([
  { name: "primaryImage", maxCount: 1 },
  { name: "secondaryImages", maxCount: 5 },
]);

export const bannerImageUpload = multer({ storage: storage }).single(
  "bannerImage"
);

export const addIcons = multer({ storage: storage }).array("icons");
