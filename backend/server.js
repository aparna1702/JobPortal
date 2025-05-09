// import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// import session from "express-session";
// import app from "./app.js";
// import passport from "./middlewares/auth.js"; // Ensure passport is initialized

// // Load environment variables
// dotenv.config({ path: "./config.env" });

// // Debug: Check if environment variables are loaded
// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
// console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// // Cloudinary Configuration
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Secure Cloudinary URL Example
// const fileUrl = cloudinary.url('Job_Seeker_Resume/u80ceydjhhmvfxxknwon', {
//     secure: true,
//     type: 'authenticated',
// });

// // Session Configuration
// app.use(
//     session({
//         secret: process.env.JWT_SECRET_KEY, // Use JWT_SECRET_KEY from config.env
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false }, // Set to true if using HTTPS
//     })
// );

// // Initialize Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Google Auth Route
// app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google Callback Route
// app.get(
//     "/api/auth/google/callback",
//     passport.authenticate("google", { failureRedirect: "/" }),
//     (req, res) => {
//         res.redirect(`http://localhost:3000?token=${req.user.token}`); // Redirect frontend with token
//     }
// );

// // Start Server
// app.listen(process.env.PORT, () => {
//     console.log(`Server is listening at port ${process.env.PORT}`);
// });


import cloudinary from "cloudinary";
import dotenv from "dotenv";
import session from "express-session";
import fs from "fs";
import multer from "multer";
import path, { dirname } from "path";
import pdf from "pdf-parse";
import { fileURLToPath } from 'url';
import app from "./app.js";
import passport from "./middlewares/auth.js";

// Enable __dirname with ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: "./config.env" });

// Debug: Check if environment variables are loaded
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// Cloudinary Configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Session Configuration
app.use(
    session({
        secret: process.env.JWT_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // set to true in production with HTTPS
    })
);

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Google Auth Route
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect(`http://localhost:3000?token=${req.user.token}`);
    }
);

// ============================
// 📄 Resume Upload + PDF Parse
// ============================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Adjust path if needed
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/upload-resume', upload.single('resume'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        res.json({ extractedText: data.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

app.get("/resume/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline",
            },
        });
    } else {
        res.status(404).send("Resume not found");
    }
});

// ===================
// 🔥 Start the Server
// ===================
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening at port ${process.env.PORT || 5000}`);
});
