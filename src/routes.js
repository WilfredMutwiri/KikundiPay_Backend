const {
  userSignup,
  getUserDetails,
} = require("./controllers/auth/userSignup.js");

const {
  addContribution,
  getContributions,
  getUserContributions,
} = require("./controllers/contributions/addContributions.js");

const {
  addGroup,
  getGroups,
  getSingleGroup,
  deleteGroup,
} = require("./controllers/groupManagement/manageGroup.js");

const { userSignin } = require("./controllers/auth/userSignin.js");

const { requestOTP } = require("./controllers/auth/requestOTP.js");

const express = require("express");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const router = express.Router();

// authentication
router.post("/user/signup/", userSignup);
router.get("/userDetails/:username", getUserDetails);
router.post("/user/signin", userSignin);
router.post("/user/requestOTP/",requestOTP)
router.post("/user/resetPassword/",resetPassword)

// contributions
router.post('/payments/addContribution/',addContribution);
router.get('/payments/getContributions',getContributions);
router.get('/payments/getUserContributions/:id',getUserContributions);

// group management
// router.post('/addGroup',addGroup);
// router.get('/getGroups',getGroups);
// router.get('/group/:id',getSingleGroup);
// router.delete('/deleteGroup/:id',deleteGroup);

module.exports = router;
