import mongoose, {isValidObjectId} from "mongoose"
import User from "../../src/models/user.model.js"
import { Subscription } from "../models/subsciption.model.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {aysncHandler} from "../utills/async-handler.js"


const toggleSubscription = aysncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = aysncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = aysncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
