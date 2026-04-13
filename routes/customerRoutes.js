const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, getProducts, updateServiceStatus, activateAcmc, cancelAcmc, deleteCustomer, searchCustomers } = require('../controllers/customerController');

router.route('/').get(getCustomers).post(createCustomer);
router.route('/search').get(searchCustomers);
router.route('/products').get(getProducts);
router.route('/:id').delete(deleteCustomer).patch(updateCustomer);
router.route('/:id/services/:index').patch(updateServiceStatus);
router.route('/:id/acmc/activate').patch(activateAcmc);
router.route('/:id/acmc/cancel').patch(cancelAcmc);

module.exports = router;
