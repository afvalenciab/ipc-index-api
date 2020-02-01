const express = require('express');
const passport = require('passport');
const authValidationHandler = require('../utils/middleware/authValidationHandler');
const UsersService = require('../services/users');
require('../utils/auth/strategies/jwt');

const usersApi = (app) => {
  const router = express.Router();
  app.use('/api/users', router);

  const usersService = new UsersService();

  router.get('/', passport.authenticate('jwt', { session: false }), authValidationHandler(), async (req, res, next) => {
    try {
      const usersList = await usersService.getUsersAll();
      res.status(200).json({
        data: usersList,
        message: 'Users list listed'
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/update/:userId', passport.authenticate('jwt', { session: false }), authValidationHandler(), async (req, res, next) => {
    const { userId } = req.params;
    const { body: user } = req;

    try {
      const updatedUserId = await usersService.updateUser({ userId, user });
      res.status(200).json({
        data: updatedUserId,
        message: 'User updated'
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/delete/:userId', passport.authenticate('jwt', { session: false }), authValidationHandler(), async (req, res, next) => {
    const { userId } = req.params;

    try {
      const deletedUserId = await usersService.deleteUser({ userId });
      res.status(200).json({
        data: deletedUserId,
        message: 'User deleted'
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = usersApi;
