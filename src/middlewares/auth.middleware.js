import User from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { aysncHandler } from "../utills/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = aysncHandler(async (req, _, next) => {
 try
 {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
       throw new ApiError(401, "Unauthorized request!"); // This code checks if an access token exists in either cookies or Authorization header
    }

    const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

 const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

 if(!user)
 {
   throw new ApiError(401,"invalid accessToken!");
 }

 req.user = user  
 next()
 }
 catch(error)
 {
    throw new ApiError(401,error?.message || "invalid access token")
 }


});
