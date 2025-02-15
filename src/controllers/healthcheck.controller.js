import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { aysncHandler } from "../utills/async-handler.js";

const healthcheck = aysncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
});

export { healthcheck };
