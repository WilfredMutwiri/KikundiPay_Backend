const { 
    signup,
    getUserDetails
} = require('./constrollers/auth/signup.js');

const { signin } = require('./constrollers/auth/signin.js');
const {
    addContribution,
    getContributions,
    getUserContributions
} = require('./constrollers/contributions/addContributions.js');

const express = require('express');
const { addGroup, getGroups, getSingleGroup, deleteGroup } = require('./constrollers/manageGroup/manageGroup.jsx');
const router = express.Router();

// authentication 
router.post('/signup',signup); 
router.get('/userDetails/:username',getUserDetails)
router.post('/signin',signin); 

// contributions
router.post('/addContribution',addContribution);
router.get('/getContributions',getContributions);
router.get('/getUserContributions/:username',getUserContributions);

// group management
router.post('/addGroup',addGroup);
router.get('/getGroups',getGroups);
router.get('/group/:id',getSingleGroup);
router.delete('/deleteGroup/:id',deleteGroup);

module.exports = router ;