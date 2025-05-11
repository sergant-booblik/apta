import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

dotenv.config();

const s3 = new S3Client({
  region: process.env.YANDEX_REGION!,
  endpoint: process.env.YANDEX_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY!,
    secretAccessKey: process.env.YANDEX_SECRET_KEY!,
  },
});

export const uploadToS3 = async (file: Express.Multer.File, username: string): Promise<string> => {
  if (!file) throw new Error('File is required');

  const fileStream = fs.createReadStream(file.path);
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const key = `uploads/${username}/${fileName}`;

  const uploadParams = {
    Bucket: process.env.YANDEX_BUCKET_NAME!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
    ACL: ObjectCannedACL.public_read,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://storage.yandexcloud.net/${process.env.YANDEX_BUCKET_NAME}/${key}`;
};

export default uploadToS3;