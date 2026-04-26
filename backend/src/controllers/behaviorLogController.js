const behaviorLogService = require('../services/behaviorLogService');

const logEvent = async (req, res, next) => {
  try {
    await behaviorLogService.logEvent(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Event logged' });
  } catch (error) {
    next(error);
  }
};

module.exports = { logEvent };
