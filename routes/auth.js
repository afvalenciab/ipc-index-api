const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const UsersService = require('../services/users');
const { config } = require('../config');
require('../utils/auth/strategies/basic');

const authApi = (app) => {
  const router = express.Router();
  app.use('/api/auth', router);
  const usersService = new UsersService();

  router.post('/login', async (req, res, next) => {
    passport.authenticate('basic', (error, user) => {
      try {
        if(error || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            next(error);
          }

          const { _id: id, email, isAdmin } = user;
          const payload = {
            sub: id,
            email,
            isAdmin
          };

          const token = jwt.sign(payload, config.authJwtSecret, { expiresIn: '15m' });

          return res.status(200).json({
            token,
            user: {
              id,
              email
            }
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

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
