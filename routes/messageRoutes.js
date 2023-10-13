const express = require("express");

const { authUser } = require("../middleware/auth");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageContrallers");

// const app = express();

const router = express.Router();
router.route("/messages").post(authUser, sendMessage);
router.route("/messages/:chatId").get(authUser, allMessages);

module.exports = router;
