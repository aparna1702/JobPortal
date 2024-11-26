import cloudinary from "cloudinary";
import app from "./app.js";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUrl = cloudinary.url('Job_Seeker_Resume/u80ceydjhhmvfxxknwon', {
    secure: true,    // Ensures HTTPS
    type: 'authenticated', // Ensures it’s only accessible with authentication
  });

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at port ${process.env.PORT}`);
});