import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { aysncHandler } from "../utills/async-handler.js";

const getVideoComments = aysncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = aysncHandler(async (req, res) => {
  // TODO: add a comment to a video
});

const updateComment = aysncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = aysncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
