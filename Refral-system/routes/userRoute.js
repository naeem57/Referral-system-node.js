const express = require ("express");
const {signup, login, userDetails} = require("../controllers/user");
// const authenticator = require("../middlewares/validator.js");


const router = express.Router();

router.post('/signup', signup);
router.post("/login", login); 
router.get("/details/:id", userDetails);

module.exports = router;



