import mongoose from "mongoose";
import { aysncHandler } from "../utills/async-handler.js";
import { ApiError } from "../utills/ApiError.js";
import User from "../models/user.model.js";
import { uploadImageonCloudinary } from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token and refresh token!"
    );
  }
};

const registerUser = aysncHandler(async (req, res) => {
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
    Array.isArray(req.files.coverImg) &&
    req.files.coverImg.length > 0
  ) {
    coverImgLocalPath = req.files.coverImg[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required!");
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

const loginUser = aysncHandler(async (req, res) => {
  // reg body => data
  // username or email
  // find the user
  // check for password
  // access token and refresh token generate
  // send cookie into the tokens

  const { email, password, userName } = req.body;

  // Ensure either username or email is provided
  if (!userName && !email) {
    throw new ApiError(400, "Username or email is required!");
  }

  const user = await User.findOne({ $or: [{ userName }, { email }] });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  // res.cookie("accessToken", accessToken, cookieOptions);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully!"
      )
    );
});

const logoutUser = aysncHandler(async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this removes the field from the document!
      },
    },
    { new: true }
  );

  console.log(result);

  if (!result) {
    return res.status(500).json(new ApiResponse(500, "Failed to update user"));
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  const loggedOutUser = req.user.userName;
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, `${loggedOutUser} logged out sucessfully!`));
});

const refreshAccessToken = aysncHandler(async (req, res) => {
  const { refreshToken } = req.cookies || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Unauthenticated!");
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refreshToken!");
    }

    if (refreshToken !== user.refreshToken) {
      throw new ApiError(401, "refresToken is expired or used!");
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refreshToken!");
  }
});

const changeCurrentPassword = aysncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required!");
  }

  const user = await User.findById(req.user?._id);
  
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  console.log('Current password:', currentPassword);
  console.log('User password hash:', user.password);

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, [], "Password changed successfully!"));
});

const getCurrentUser = aysncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "current User found successfully!"));
});

const updateAccountDetails = aysncHandler(async (req, res) => {
  const { fullName, userName, email } = req.body;

  if (!(fullName || userName)) {
    throw new ApiError(400, "fullname or username are required!");
  }

  if (!email) {
    throw new ApiError(400, "email is required!");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email: email,
        userName,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, updateUser, "Account details updated successfully!")
    );
});

const updateUserAvatar = aysncHandler(async (req, res) => {
  const file = req.file?.path;
  if (!file) {
    throw new ApiError(400, "Avatar is required!");
  }

  const avatar = await uploadImageonCloudinary(file);
  if (!avatar.url) {
    throw new ApiError(500, "Avatar not uploaded!");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully!"));
});

const updateUserCoverImage = aysncHandler(async (req, res) => {
  const file = req.file?.path;
  if (!file) {
    throw new ApiError(400, "Avatar is required!");
  }

  const coverImg = await uploadImageonCloudinary(file);
  if (!coverImg.url) {
    throw new ApiError(500, "Avatar not uploaded!");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { coverImg: coverImg.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "coverImg updated successfully!"));
});

const getUserChannelProfile = aysncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(404, "userName is missing!");
  }

  const channel = await User.aggregate([
    {
      $match: { userName: userName.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        subscribers: 0,
        subscribedTo: 0,
      },
    },
  ]);

  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(404, "channel doesn't exist!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "user channel fetched successfully!")
    );
});

const getWatchHistory = aysncHandler(async(req, res) => {
  const user = await User.aggregate([
      {
          $match: {
              _id: new mongoose.Types.ObjectId(req.user._id)
          }
      },
      {
          $lookup: {
              from: "videos",
              localField: "watchHistory",
              foreignField: "_id",
              as: "watchHistory",
              pipeline: [
                  {
                      $lookup: {
                          from: "users",
                          localField: "owner",
                          foreignField: "_id",
                          as: "owner",
                          pipeline: [
                              {
                                  $project: {
                                      fullName: 1,
                                      username: 1,
                                      avatar: 1
                                  }
                              }
                          ]
                      }
                  },
                  {
                      $addFields:{
                          owner:{
                              $first: "$owner"
                          }
                      }
                  }
              ]
          }
      }
  ])

  return res
  .status(200)
  .json(
      new ApiResponse(
          200,
          user[0].watchHistory,
          "Watch history fetched successfully"
      )
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
