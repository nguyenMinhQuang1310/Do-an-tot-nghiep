const BehaviorLog = require('../models/BehaviorLog');

/**
 * Ghi log hành vi người dùng.
 * Chỉ log user đã đăng nhập.
 */
const logEvent = async (userId, data) => {
  if (!userId) return null;

  const log = await BehaviorLog.create({
    userId,
    productId: data.productId,
    variantId: data.variantId || undefined,
    eventType: data.eventType,
    sourceContext: data.sourceContext || undefined,
  });

  return log;
};

module.exports = { logEvent };
