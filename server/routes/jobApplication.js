import express from 'express';
import { getJobApplicationsDetails, postJobApplicationQuestions, batchUpdateJobApplicationStatus, getJobApplicationDetailsByUrl } from '../controllers/jobApplication.js';

const router = express.Router();

router.get('/', getJobApplicationsDetails);
router.get('/url', getJobApplicationDetailsByUrl);
router.post('/', postJobApplicationQuestions);
router.post('/batch-update', batchUpdateJobApplicationStatus);

export default router;