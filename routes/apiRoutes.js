const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/review', reviewController.createReview);
router.get('/reports/:id', reviewController.getReport);
router.get('/reports/:id/download', reviewController.downloadReport);

module.exports = router;
