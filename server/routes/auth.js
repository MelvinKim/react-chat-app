const express = require("express");

//import the controllers
const { signup , login } = require("../controllers/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;