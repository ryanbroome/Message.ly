//* Anything not a comment added by me.

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Invalid username / password", 400);
    }
    const result = await db.query(
      `
    SELECT username, password 
    FROM users
    WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
      }
    }
    throw new ExpressError("Invalid username, password", 400);
  } catch (e) {
    return next(e);
  }
});
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const user = await User.register(username, password, first_name, last_name, phone);
    console.log("user.password", user.password);
    return res.json({ token: user.password });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
