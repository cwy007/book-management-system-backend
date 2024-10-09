import * as multer from 'multer';
import * as fs from 'fs';

function mathRandomString() {
  return Math.random()
    .toString(36) // '0.hpc1hhc5b4s'
    .substring(7); // 'hc5b4s'
}

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync('uploads');
    } catch (error) {
    }

    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + mathRandomString() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
})
