import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import User from "../models/user.model.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {aysncHandler} from "../utills/async-handler.js"
import {uploadImageonCloudinary} from "../utills/cloudinary.js"


const getAllVideos = aysncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = aysncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = aysncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = aysncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = aysncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = aysncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
