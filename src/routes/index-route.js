'use strict';

var express = require('express');
var router = express.Router();


router.get('/', (req, res, next) => {
  res.status(200).send({
      title: 'Node Stroe API',
      version: '0.0.2',
  });
});

module.exports = router;
