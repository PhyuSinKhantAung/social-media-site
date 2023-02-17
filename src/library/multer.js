const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const { ApiError } = require('../errors');

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
  console.log('mime type', file.mimetype);

  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new ApiError('You cannot add this kind of file type.', 400), false);
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
