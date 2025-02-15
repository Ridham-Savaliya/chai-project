import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { aysncHandler } from "../utills/async-handler.js";
import { uploadImageonCloudinary } from "../utills/cloudinary.js";

const getAllVideos = aysncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});



const publishAVideo = aysncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  console.log("Request Body:", req.body);
  console.log("Files:", req.files);

  if (
    !title ||
    !description ||
    !req.files.videoFile ||
    !req.files.thumbNail ||
    isPublished === undefined
  ) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "All the details are mandatory for the video publishing!"
        )
      );
  }

  // Check if videoFile and thumbNail are arrays and have elements
  if (!Array.isArray(req.files.videoFile) || req.files.videoFile.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "video file is required!"));
  }

  if (!Array.isArray(req.files.thumbNail) || req.files.thumbNail.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "thumbnail is required!"));
  }

  // Access the file paths correctly
  const videoFilePath = req.files.videoFile[0].path;
  const thumbNailFilePath = req.files.thumbNail[0].path;

  console.log("Video File Path:", videoFilePath);
  console.log("Thumbnail File Path:", thumbNailFilePath);

  if (!videoFilePath || !thumbNailFilePath) {
    return res
      .status(400)
      .json(new ApiError(400, "video and thumbnails are required!"));
  }

  const video = await uploadImageonCloudinary(videoFilePath, "video");
  const thumbnail = await uploadImageonCloudinary(thumbNailFilePath, "image");

  if (!video || !thumbnail) {
    return res
      .status(500)
      .json(new ApiError(500, "Error uploading files to Cloudinary"));
  }

  const duration = video.duration ? Math.round(video.duration) : 0;

  const newVideo = await Video.create({
    title,
    description,
    isPublished: isPublished === 'true',
    videoFile: video.url,
    thumbNail: thumbnail.url,
    duration,
    owner: req.user._id,
  });

  if (!newVideo) {
    return res.status(500).json(new ApiError(500, "video is not published!"));
  }

  res
    .status(201)
    .json(new ApiResponse(201, newVideo, "video published successfully!"));
});



const incrementViews = aysncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json(new ApiError(404, "video is not found!"));
  }

  video.views += 1;
  await video.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, { views: video.views }, "View count updated"));
});

const getVideoById = aysncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = aysncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = aysncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = aysncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  incrementViews,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
