//* Anything not a comment added by me.

const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");

const db = require("../db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");

const User = require("../models/user");
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`
    SELECT username, first_name, last_name, phone
    FROM users
    ORDER BY username
    `);
    return res.json({ users: results.rows });
  } catch (e) {
    return next(e);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async (req, res, next) => {
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

router.get("/:username/to", async (req, res, next) => {
  try {
    // *const username = req.params.username;
    // *const msgs = User.messagesTo(username);
    return res.json({ msgs });
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
module.exports = router;
