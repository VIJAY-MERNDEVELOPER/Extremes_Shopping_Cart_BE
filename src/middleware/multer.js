import multer from "multer";

import path from "path";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
export const upload = multer({
  storage: storage,
});
