import multer from "multer";

import path from "path";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, `${file.originalname}`);
  },
});
export const upload = multer({
  storage: storage,
});
