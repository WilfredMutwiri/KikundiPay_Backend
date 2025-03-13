const { signup } = require('./constrollers/signup');
const { signin } = require('./constrollers/signin');
const {addContribution} = require('./constrollers/contributions/addContributions.js');
const express = require('express');
const router = express.Router();

// authentication 
router.post('/signup',signup); 
router.post('/signin',signin); 

// contributions
router.post('/addContribution',addContribution);

module.exports = router ;