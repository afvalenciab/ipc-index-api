const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async getUsersAll() {
    const usersList = await this.mongoDB.getAll(this.collection, {});
    return usersList || [];
  }

  async updateUser({ userId, user } = {}) {
    const updatedUserId = await this.mongoDB.update(this.collection, userId, user);
    return updatedUserId;
  }

  async deleteUser({ userId }) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUserId;
  }

  async createUser({ user }) {
    const { email, password, isAdmin, wrongPass } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUserId = await this.mongoDB.create(this.collection, {
      email,
      password: hashedPassword,
      isAdmin: Boolean(isAdmin),
      wrongPass
    });

    return createdUserId;
  }

  async getOrCreateUser({ user }) {
    const queriedUser = await this.getUser({ email: user.email });

    if(queriedUser) {
      return queriedUser;
    }

    await this.createUser({ user });
    return await this.getUser({ email: user.email});
  }
}

module.exports = UsersService;
