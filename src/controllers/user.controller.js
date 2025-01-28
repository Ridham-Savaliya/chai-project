import { aysncHandler } from "../utills/async-handler.js";
import { ApiError } from "../utills/ApiError.js";
import User from "../models/user.model.js";
import { uploadImageonCloudinary } from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";
const registerUser = aysncHandler(async (req, res, next) => {
  // get the user data from the request body
  // validation - not empty
  // check if user already exists : email,username
  // check for images,check for avtar
  // upload them to cloudinary and extract the url
  // creats user object - creats entry in the database
  // send the response remvoing the password and refresh token
  // check for user creation
  // return response
  const { fullName, userName, email, password } = req.body;
  // console.log(email);

  // if(fullName === "" || userName === "" || email === "" || password === "")
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(avtarLocalPath);
  // const coverImgLocalPath = req.files?.coverImg[0]?.path;
  // console.log(coverImgLocalPath);

  let coverImgLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImg > 0 && req.files.coverImg[0].path)
  ) {
    coverImgLocalPath = req.files.coverImg[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar and cover image are required!");
  }

  const avatar = await uploadImageonCloudinary(avatarLocalPath);
  console.log(avatar);
  const coverimage = await uploadImageonCloudinary(coverImgLocalPath);
  console.log(coverimage);

  if (!avatar) {
    throw new ApiError(400, "images are required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImg: coverimage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

export { registerUser };
