import multer from "multer";

// const uploadProfile = multer({});
const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/profile"); // Folder untuk menyimpan file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Nama file yang disimpan
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024, // Limit file size 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.split(".").pop().toLowerCase());
    if (mimetype && extname) {
      return cb(null, true); // File type valid, proceed with upload
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed!"), false); // Reject file
    }
  },
});

export { uploadProfile };
