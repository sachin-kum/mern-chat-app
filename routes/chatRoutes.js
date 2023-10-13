const express = require("express");
const { authUser } = require("../middleware/auth");

const {
  chatAccess,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/chats").post(authUser, chatAccess);
router.route("/fetch-chats").get(authUser, fetchChats);
router.route("/crate-group").post(authUser, createGroupChat);

router.route("/rename-group").put(authUser, renameGroupChat);
router.route("/remove-from-group").put(authUser, removeFromGroup);
router.route("/add-to-group").put(authUser, addToGroup);

module.exports = router;
