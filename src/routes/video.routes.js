import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  incrementViews,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/publishvideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbNail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);
// get all videos
router.route("/").get(getAllVideos);

// get,delete,update(thumbnail) videos by id
router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/:videoId/views").post(incrementViews);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
