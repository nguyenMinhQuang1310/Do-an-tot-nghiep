const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const result = await userService.toggleActive(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, toggleActive };
