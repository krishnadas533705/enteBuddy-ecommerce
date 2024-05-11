import multer from "multer";
import path from "path";

let __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "primaryImage") {
      cb(null,"C:/Users/ASUS/OneDrive/Desktop/enteBuddy/enteBuddy/server/public/uploads/primaryImages");

    } else if (file.fieldname == "secondaryImages") {
      cb(null, "C:/Users/ASUS/OneDrive/Desktop/enteBuddy/enteBuddy/server/public/uploads/secondaryImages");

    } else if (file.fieldname == "bannerImage") {
      cb(null,"C:/Users/ASUS/OneDrive/Desktop/enteBuddy/enteBuddy/server/public/uploads/bannerImages");
      
    } else {
      cb(new Error("Unexpected field"));
    }
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

