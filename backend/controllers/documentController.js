const Document = require("../models/Document");
const cloudinary = require("../config/cloudinary");
const axios=require("axios");
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a file"
            });
        }

        const result = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "digiwallet"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

       const document = await Document.create({
    user: req.user,
    originalName: req.file.originalname,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    mimeType: req.file.mimetype,
    fileSize: req.file.size
});

        res.status(201).json({
            message: "Document uploaded successfully",
            document
        });

    } catch (error) {
        console.error("Upload error:", error);

        res.status(500).json({
            message: "Document upload failed"
        });
    }
};
const getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            user: req.user
        }).sort({
            createdAt: -1
        });

        res.json({
            documents
        });

    } catch (error) {
        console.error("Get documents error:", error);

        res.status(500).json({
            message: "Failed to fetch documents"
        });
    }
};
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        // Delete file from Cloudinary
        await cloudinary.uploader.destroy(
            document.publicId,
            {
                resource_type: "raw"
            }
        );

        // Delete document from MongoDB
        await Document.findByIdAndDelete(document._id);

        res.json({
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error("Delete error:", error);

        res.status(500).json({
            message: "Failed to delete document"
        });
    }
};
const downloadDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        const response = await axios.get(
            document.fileUrl,
            {
                responseType: "stream"
            }
        );

        res.setHeader(
    "Content-Type",
    document.fileType || "application/octet-stream"
);

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${document.originalName}"`
        );

        response.data.pipe(res);

    } catch (error) {
        console.error("Download error:", error);

        res.status(500).json({
            message: "Failed to download document"
        });
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    deleteDocument,
    downloadDocument
};