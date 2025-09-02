const express = require("express");
const router = express.Router();

const {
  getServices,
  getServiceById,
} = require("../controllers/serviceController");
const { getBlogs, getBlogById } = require("../controllers/blogController");
const {
  upload,
  contactFormHandler,
} = require("../controllers/contactController");
const { getCertificates } = require("../controllers/certificates");
router.get("/getservices", getServices);
router.get("/getblog/:id", getBlogById);
router.get("/getblogs", getBlogs);
router.get("/getcertificates", getCertificates);
router.get("/getservice/:id", getServiceById);
router.post("/contact", upload.single("file"), contactFormHandler);

module.exports = router;
