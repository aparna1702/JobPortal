import express from "express";
import { deleteJob, getAllJobs, getASingleJob, getMyJobs, postJob, recommendJobs } from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
const router= express.Router();
router.post("/post", isAuthenticated, isAuthorized("Employer"),postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"),getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", isAuthenticated, getASingleJob);
router.post('/recommend', isAuthenticated, isAuthorized("Job Seeker"),recommendJobs);

export default router;