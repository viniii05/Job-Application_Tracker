const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const upload = multer({ storage: multer.memoryStorage() });

const uploadToS3 = async (file) => {
    const fileName = `attachments/${Date.now()}_${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
    };

    try {
        await s3.send(new PutObjectCommand(params));
        return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error("AWS Upload Error:", error);
        throw new Error("Failed to upload file to S3");
    }
};

module.exports = { upload, uploadToS3 };
