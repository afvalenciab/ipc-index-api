const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UsersService = require('../../../services/users');
const sendEmail = require('../../sendEmail');

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    const usersService = new UsersService();

    try {
      const user = await usersService.getUser({ email });
      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      const userToUpdate = {
        userId: user._id,
        user: {
          wrongPass: 0
        }
      };

      if (!(await bcrypt.compare(password, user.password))) {
        userToUpdate.user.wrongPass = user.wrongPass + 1;
        usersService.updateUser( userToUpdate );
        if (userToUpdate.user.wrongPass === 3) {
          sendEmail(user);
        }
        return cb(boom.unauthorized(), false);
      }

      if( user.wrongPass > 0 ) {
        usersService.updateUser( userToUpdate );
      }

      delete user.password;
      return cb(null, user);
    } catch (error) {
      cb(error);
    }
  })
);