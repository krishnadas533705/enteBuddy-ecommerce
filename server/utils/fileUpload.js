import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "primaryImage") {
      cb(null,"C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/primaryImages");
    } else if (file.fieldname == "secondaryImages") {
      cb(null, "C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/secondaryImages");
    } else if (file.fieldname == "bannerImage") {
      cb(null, "C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/bannerImages");
      
    } else {
      cb(new Error("Unexpected field"));
    }
  },
    // hi kd bro ,mattumbo ith mattale :)
  //   if (file.fieldname == "primaryImage") {
  //     cb(null,"C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/primaryImages");
  //   } else if (file.fieldname == "secondaryImages") {
  //     cb(null, "C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/secondaryImages");
  //   } else if (file.fieldname == "bannerImage") {
  //     cb(null, "C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public/uploads/bannerImages");
      
  //   } else {
  //     cb(new Error("Unexpected field"));
  //   }
  // },
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



// destination: (req, file, cb) => {
//   if (file.fieldname == "primaryImage") {
//     cb(null, path.join(__dirname, "/Public/uploads/primaryImages"));
//   } else if (file.fieldname == "secondaryImages") {
//     cb(null, path.join(__dirname, "/Public/uploads/secondaryImages"));
//   } else if (file.fieldname == "bannerImage") {
//     cb(null,path.join( __dirname,"/Public/uploads/bannerImages"));
    
    
//   } else {
//     cb(new Error("Unexpected field"));
//   }

export const imageUpload = multer({ storage: storage }).fields([
  { name: "primaryImage", maxCount: 1 },
  { name: "secondaryImages", maxCount: 5 },
]);

export const bannerImageUpload = multer({ storage: storage }).single(
  "bannerImage"
);

