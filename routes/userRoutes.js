const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const { authUser } = require("../middleware/auth");
const upload = require("../upload/fileupload");
// const app = express();

const router = express.Router();

router.route("/register").post(upload.single("pic"), registerUser);
router.post("/login", loginUser);
router.route("/search-user").get(authUser, allUsers);

module.exports = router;
