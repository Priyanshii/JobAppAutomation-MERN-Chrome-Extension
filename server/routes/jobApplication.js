import express from 'express';
import { getJobApplicationsDetails, postJobApplicationQuestions, batchUpdateJobApplicationStatus } from '../controllers/jobApplication.js';

const router = express.Router();

router.get('/', getJobApplicationsDetails);
router.post('/', postJobApplicationQuestions);
router.post('/batch-update', batchUpdateJobApplicationStatus);

export default router;