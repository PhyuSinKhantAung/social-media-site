const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'photos',
    format: 'jpeg',
    public_id: (req, file) => {
      const ext = file.originalname.split('.').slice(-1).pop();
      const filename = `${file.fieldname}-${Date.now()}.${ext}`;
      return filename;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(
      new Error({
        code: 400,
        message: 'You cannot add this kind of file type',
      }),
      false
    );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

const uploadImages = upload.array('images', 10);

const uploadProfilePic = upload.single('profile_pic');

// const uploadImages = upload.fields([{ name: 'images', maxCount: 15 }]);

module.exports = { uploadImages, uploadProfilePic };
