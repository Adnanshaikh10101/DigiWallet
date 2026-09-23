const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadDocument,
    getMyDocuments,
    deleteDocument,
    downloadDocument
} = require("../controllers/documentController");


// Upload document
router.post(
    "/upload",
    protect,
    upload.single("document"),
    uploadDocument
);


// Get my documents
router.get(
    "/my-documents",
    protect,
    getMyDocuments
);

router.delete(
    "/:id",
    protect,
    deleteDocument
);
router.get(
    "/download/:id",
    protect,
    downloadDocument
);


module.exports = router;