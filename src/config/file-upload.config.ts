import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../utils/http-errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new BadRequestError(
      'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
    );
    return cb(error, false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: fileFilter,
});