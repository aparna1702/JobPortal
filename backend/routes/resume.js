//     import express from 'express';
// import fs from 'fs';
// import multer from 'multer';
// import pdfParse from 'pdf-parse';
// import { calculateATSScore } from '../utils/atsScorer.js';

//     const router = express.Router();

//     // Setup multer for file upload
//     const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
//     });
//     const upload = multer({ storage });

//     // POST /api/resume/upload
//     router.post('/upload', upload.single('resume'), async (req, res) => {
    
//     const { jobDescription } = req.body;
//     const resumePath = req.file.path;

//     try {
//         const resumeBuffer = fs.readFileSync(resumePath);
//         const parsed = await pdfParse(resumeBuffer);
//         const resumeText = parsed.text;

//         const atsScore = calculateATSScore(resumeText, jobDescription);

//         res.status(200).json({
//         atsScore,
//         resumeText
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to parse resume or calculate ATS score' });
//         }
//     });

//     export default router;


import express from 'express';
import fs from 'fs';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { Job } from '../models/jobSchema.js';
import { calculateATSScore, getRecommendedJobs } from '../utils/atsScore.js'; // ✅ Import getRecommendedJobs

const router = express.Router();

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  const { jobDescription } = req.body;
  const resumePath = req.file.path;

  try {
    const resumeBuffer = fs.readFileSync(resumePath);
    const parsed = await pdfParse(resumeBuffer);
    const resumeText = parsed.text;

    // ✅ 1. Calculate ATS Score for provided JD
    const atsScore = calculateATSScore(resumeText, jobDescription);

    // ✅ 2. Load job list (replace this with your DB query if needed)
    const jobListFromDB = await Job.find();

    // ✅ 3. Generate recommended jobs
    const recommendedJobs = getRecommendedJobs(resumeText, jobListFromDB);

    // ✅ 4. (Optional) Delete uploaded file
    fs.unlinkSync(resumePath);

    // ✅ 5. Send response including recommendations
    res.status(200).json({
      atsScore,
      resumeText,
      recommendedJobs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse resume or calculate ATS score' });
  }
});

export default router;
