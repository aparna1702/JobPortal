import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true // Ensures uniqueness without affecting non-Google users
    },
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must contain at least 3 characters."],
        maxLength: [30, "Name cannot exceed 30 characters."],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    niches: {
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only if googleId is not present
        },
        minLength: [8, "Password must contain at least 8 characters."],
        maxLength: [32, "Password cannot exceed 32 characters."],
        select: false
    },
    resume: {
        public_id: String,
        url: String,
    },
    coverLetter: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer","user"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);

// // import mongoose from "mongoose";
    // // import validator from "validator";
    // import bcrypt from "bcrypt";
    // import jwt from "jsonwebtoken";
    // import mongoose from "mongoose";
    // import validator from "validator";

    // const userSchema = new mongoose.Schema({
    //     googleId: {
    //         type: String,
    //         unique: true,
    //         sparse: true // Ensures uniqueness without affecting non-Google users
    //     },
    //     name:{
    //         type:String,
    //         required: true,
    //         minLength:[3, "Name must contain at least 3 characters."],
    //         maxLength:[30, "Name cannot exceed 30 characters."],
    //     },
    //     email:{
    //         type: String,
    //         required:true,
    //         validate: [validator.isEmail, "Please provide valid email."],
    //     },
    //     phone:{
    //         type: Number,
    //         required: true,
    //     },
    //     address:{
    //         type: String,
    //         required:true,
    //     },
    //     niches:{
    //         firstNiche: String,
    //         secondNiche: String,
    //         thirdNiche: String,
    //     },
    //     password:{
    //         type: String,
    //         required: true,
    //         minLength: [8, "Password must contain at least 8 characters."],
    //         maxLength: [32, "Password cannot exceed 32 character."],
    //         select: false
    //     },
    //     resume:{
    //         public_id: String,
    //         url: String,
    //     },
    //     coverLetter:{
    //         type: String,
    //     },
    //     role:{
    //         type: String,
    //         required: true,
    //         enum: ["Job Seeker", "Employer"],
    //     },
    //     createdAt:{
    //         type: Date,
    //         default: Date.now,
    //     },
    // });

    // userSchema.pre("save", async function (next) {
    //     if(!this.isModified("password")){
    //         next();
    //     }
    //     this.password=await bcrypt.hash(this.password, 10);
    // });

    // userSchema.methods.comparePassword= async function(enteredPassword){
    //     return await bcrypt.compare(enteredPassword, this.password);
    // }

    // userSchema.methods.getJWTToken= function() {
    //     return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
    //         expiresIn: process.env.JWT_EXPIRE,

    //     });
    // };
    // export const User = mongoose.model("User", userSchema);