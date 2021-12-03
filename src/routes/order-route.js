'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth_service');


router.post('/', authService.authorize, controller.post);  
router.get('/', authService.authorize, controller.get);  


module.exports = router;
