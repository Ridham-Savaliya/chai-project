import mongoose, { isValidObjectId } from "mongoose"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {aysncHandler} from "../utills/async-handler.js"
import {Tweet} from "../models/tweet.model.js"
import User from "../../src/models/user.model.js"

const createTweet = aysncHandler(async (req, res) => {
    //TODO: create tweet
})

const getUserTweets = aysncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = aysncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = aysncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
