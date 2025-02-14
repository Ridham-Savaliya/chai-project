import mongoose, { isValidObjectId } from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {aysncHandler} from "../utils/aysncHandler.js"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"

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
