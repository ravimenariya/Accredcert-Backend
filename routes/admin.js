const express = require('express');
const router = express.Router();
const {editservice,addservice,deleteService}=require('../controllers/serviceController')
const {editBlogs, deleteBlogs,addBlog}=require('../controllers/blogController');
const { listCountries, createCountry, updateCountry, mergeCountries, deleteCountry } = require('../controllers/countryController');
const { route } = require('./user');
const { deleteCertificate,addCertificate } = require('../controllers/certificates');
router.put('/editservice',editservice);
router.post('/addservice',addservice)
router.delete('/deleteservice/:id',deleteService)

// Country management (admin)
router.get('/getcountries', listCountries);
router.post('/createcountry', createCountry);
router.put('/updatecountry/:id', updateCountry);
router.post('/mergecountries', mergeCountries);
router.delete('/deletecountry/:id', deleteCountry);

router.put('/editblog',editBlogs)
router.post('/addblog',addBlog)
router.delete('/deleteblog/:id',deleteBlogs)

router.delete('/deletecertificate/:id',deleteCertificate)
router.post('/addcertificate',addCertificate)
module.exports = router;
