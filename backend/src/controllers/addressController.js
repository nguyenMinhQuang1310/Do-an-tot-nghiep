const addressService = require('../services/addressService');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id);
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.user.id, req.params.id);
    res.json({ success: true, message: 'Đã xóa địa chỉ' });
  } catch (error) {
    next(error);
  }
};

const setDefault = async (req, res, next) => {
  try {
    const address = await addressService.setDefault(req.user.id, req.params.id);
    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress, setDefault };
