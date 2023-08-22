const express = require("express");
const authController = require("../app/https/controllers/authController/authController");
const dashbaordController = require("../app/https/controllers/dataController/dashbaordController");
const orderController = require("../app/https/controllers/orderController/Customer/orderController");
const cateringController = require("../app/https/controllers/serviceController/cateringController");
const commonController = require("../app/https/controllers/serviceController/commonController");
const decoratorController = require("../app/https/controllers/serviceController/decoratorController");
const photogrpghyController = require("../app/https/controllers/serviceController/photograpghyController");
const venueController = require("../app/https/controllers/serviceController/venueController");
const countServiceControlller = require("../app/https/controllers/countServiceController/countServiceController");
const adminController = require("../app/https/controllers/adminController/adminController");
const otpController = require("../app/https/controllers/otpController/otpController");
const Router = express.Router();

Router.get('/all-venues', venueController().allVenues);
Router.get('/all-photograpgher', photogrpghyController().allPhotograpgher);
Router.get('/all-catering', cateringController().allCatering);
Router.get('/all-decorators', decoratorController().allDecorator);
Router.post('/service-by-serviceId', commonController().serviceById);
Router.post('/delete/order', orderController().deleteOrder);
// Router.post('/update/orderStatus', [auth, vendor], orderController().updateOrderStatus);
Router.post('/update/orderStatus', orderController().updateOrderStatus);
Router.get('/allorders/customer/:id', orderController().getUserOrders);
Router.get('/dashbaord/data/:id', dashbaordController().dashbaord);
Router.get('/get-all-data', adminController().index);
Router.patch('/approve-service/:id', adminController().approveService);
Router.delete('/delete-service/:id', adminController().deleteService);
Router.post('/login', authController().login);
Router.get('/logout/:id', authController().logout);
Router.get('/totalService', countServiceControlller().index);
Router.post('/update-password', authController().updatePassword);

Router.post('/send-otp', otpController.sendOtp);
Router.post('/verify-otp', otpController.verifyOtp);
Router.post('/checkUser/userPhone', authController().checkUserByPhone);
Router.post('/update-password', authController().updatePassword);

module.exports = Router;
