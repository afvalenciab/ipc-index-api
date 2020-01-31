const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const UsersService = require('../services/users');
const { config } = require('../config');

const authApi = (app) => {
  const router = express.Router();
  app.use('/api/auth', router);
  const usersService = new UsersService();

  router.post('/register', async (req, res, next) => {
    const { body: user } = req;

    try {
      const createdUserId = await usersService.createUser({ user });
      res.status(201).json({
        data: createdUserId,
        message: 'User created'
      });
    } catch (error) {
      next(error);
    }
  });


};

module.exports = authApi;
