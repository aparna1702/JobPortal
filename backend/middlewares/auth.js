import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

dotenv.config({ path: "./config.env" });

// Debug: Check if environment variables are loaded
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:"218675244850-7v35od2io2sj0jagsgm1dl7gld2u510h.apps.googleusercontent.com",
      clientSecret:"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",
      callbackURL:"http://localhost:4000/api/auth/google/callback", // Ensure this matches the Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "user", // Default role; modify as needed
          });

          await user.save();
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// JWT Authentication Middleware
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not Authenticated.", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  next();
});

// Role-Based Authorization Middleware
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`
        )
      );
    }
    next();
  };
};

export default passport;

// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { User } from "../models/userSchema.js";
// import { catchAsyncErrors } from "./catchAsyncErrors.js";
// import ErrorHandler from "./error.js";

// dotenv.config({ path: "./config.env" });

// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);

// // Google OAuth Strategy
// passport.use(
// new GoogleStrategy(
//     {
//         clientID:"218675244850-7v35od2io2sj0jagsgm1dl7gld2u510h.apps.googleusercontent.com",
//         clientSecret:"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" ,
//         callbackURL:"http://localhost:4000/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new User({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             role: "user", // Default role; modify as needed
//           });

//           await user.save();
//         }

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
//           expiresIn: "1h",
//         });

//         return done(null, { user, token });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );


// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // JWT Authentication Middleware
// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorHandler("User is not Authenticated.", 400));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);

//     next();
// });

// // Role-Based Authorization Middleware
// export const isAuthorized = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new ErrorHandler(`${req.user.role} not allowed to access this resource.`)
//             );
//         }
//         next();
//     };
// };

// export default passport;


// // import jwt from "jsonwebtoken";
// // import { User } from "../models/userSchema.js";
// // import { catchAsyncErrors } from "./catchAsyncErrors.js";
// // import ErrorHandler from "./error.js";

// // export const isAuthenticated= catchAsyncErrors(async (req, res, next)=> {
// //     const { token }= req.cookies;
// //     if(!token){
// //         return next(new ErrorHandler(" User is not Authenticated.",400));
// //     }
// //     const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
// //     req.user = await User.findById(decoded.id);

// //     next();
// // });

// // export const isAuthorized= (...roles)=>{
// //     return(req,res, next)=>{
// //         if(!roles.includes(req.user.role)){
// //             return next(
// //                 new ErrorHandler(
// //                     `${req.user.role} not allowed to access this resource.`
// //                 )
// //             );
// //         }
// //         next();
// //     };
// // };
