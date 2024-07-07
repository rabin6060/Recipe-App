import express, { Request, Response } from 'express';
import cloudinary from '../../utils/Cloudinary';
import upload from '../../Middleware/multer';

const router = express.Router();

router.post('/', upload.array('image', 5), async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const files = req.files as Express.Multer.File[];
  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path)
  );

  try {
    const results = await Promise.all(uploadPromises);
    const uploadUrls: string[] = results.map(result => result.secure_url);
    
    res.status(200).json({
      success: true,
      message: 'Uploaded!',
      data: uploadUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
    });
  }
});

export default router;
