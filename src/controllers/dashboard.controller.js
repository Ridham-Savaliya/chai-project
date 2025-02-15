import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { aysncHandler } from "../utils/aysncHandler.js";

const getChannelStats = aysncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = aysncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
});

// hello this is the chnages i made to check wheather the github credential is removed or not!

export { getChannelStats, getChannelVideos };
