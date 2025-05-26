const express = require("express");
const router = express.Router();

const { enrollFreeCourse } = require("../controllers/Payments"); // hoặc nơi bạn đặt controller
const { auth, isStudent } = require("../middlewares/auth");

router.post("/enroll-free", auth, isStudent, enrollFreeCourse);

module.exports = router;
