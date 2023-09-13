const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const Message = require("../models/message");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next) => {
  try {
    return res.json(await Message.get(req.params.id));
  } catch (e) {
    return next(e);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
//
router.post("/", async (req, res, next) => {
  try {
    return res.json(await Message.create(req.body));
  } catch (e) {
    if (e.code === "23503") {
      return res.json({ message: `This error is because you have an incorrect username ${req.body.from_username} or ${req.body.to_username} that does not exist, please check your spelling and try again` });
    } else {
      return next(e);
    }
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async (req, res, next) => {
  try {
    const m = await Message.markRead(req.params.id);
    if (!m) {
      throw new ExpressError(`No message with id ${id}`);
    }
    const { id, read_at } = m;
    return res.json({ message: { id, read_at } });
  } catch (e) {
    return next(e);
  }
});
module.exports = router;
