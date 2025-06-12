import { IMAGE_FOLDER } from '@src/modules/manage/application/constants/inject-key.const';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerStorage = diskStorage({
  destination: IMAGE_FOLDER,
  filename: (req, file, callback) => {
    const timestamp = Date.now();
    const ext = extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(/\s+/g, '_')
      .replace(ext, '');
    const filename = `${sanitizedName}-${timestamp}${ext}`;
    callback(null, filename);
  },
});
