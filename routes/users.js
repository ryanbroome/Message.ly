const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

/**  Had to use solution to remember using the middleware **/
router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username;
    if (!username) {
      throw new ExpressError("username required", 400);
    }
    const user = await User.get(username);
    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username;
    const messages = await User.messagesTo(username);
    return res.json({ messages });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username;
    const results = await User.messagesFrom(username);
    console.log(results.rows);
    return res.json(results);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
