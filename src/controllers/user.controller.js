import { aysncHandler } from "../utills/async-handler.js"
const registerUser = aysncHandler(async (req, res, next) => {
    // code here
  return  res.status(200).json({success: true, data: "User registered successfully"})
})


export {registerUser}
