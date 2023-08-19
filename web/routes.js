const express = require("express");
const authController = require("../app/https/controllers/authController/authController");
const dashbaordController = require("../app/https/controllers/dataController/dashbaordController");
const orderController = require("../app/https/controllers/orderController/Customer/orderController");
const otpController = require("../app/https/controllers/otpController/otpController");
const reviewController = require("../app/https/controllers/reviewController/reviewController");
const cateringController = require("../app/https/controllers/serviceController/cateringController");
const commonController = require("../app/https/controllers/serviceController/commonController");
const decoratorController = require("../app/https/controllers/serviceController/decoratorController");
const photogrpghyController = require("../app/https/controllers/serviceController/photograpghyController");
const venueController = require("../app/https/controllers/serviceController/venueController");
const auth = require("../app/https/middlewares/auth");
const vendor = require("../app/https/middlewares/vendor");
const countServiceControlller = require("../app/https/controllers/countServiceController/countServiceController");
const admin = require("../app/https/middlewares/admin");
const adminController = require("../app/https/controllers/adminController/adminController");
const { sendBysms } = require("../Services/OtpService");
const Router = express.Router();


Router.post('/login', authController().login);
Router.post('/register', authController().register);
Router.get('/logout', auth, authController().logout);
Router.post('/send-otp', otpController.sendOtp);
Router.post('/verify-otp', otpController.verifyOtp);
Router.get('/refresh', authController().autoLogin);
Router.post('/checkUser/userPhone', authController().checkUserByPhone);
Router.post('/update-password', authController().updatePassword);



Router.get('/dashbaord/data', [auth, vendor], dashbaordController().dashbaord);

// venue
Router.post('/venue-register', [auth, vendor], venueController().register);
Router.get('/check-service', auth, commonController().getServiceByUserId);
// Router.get('/check-venue', auth, commonController().getServiceByUserId);
Router.post('/service-by-serviceId', commonController().serviceById);
Router.get('/all-venues', venueController().allVenues);
Router.post('/service-dates', commonController().getDates);

// photograpghy
Router.post('/register/photograpghy', [auth, vendor], photogrpghyController().register);
Router.get('/all-photograpgher', photogrpghyController().allPhotograpgher);

// catering
Router.post('/register/catering', [auth, vendor], cateringController().register);
Router.get('/all-catering', cateringController().allCatering);

// decorator
Router.post('/register/decorator', [auth, vendor], decoratorController().register);
Router.get('/all-decorators', decoratorController().allDecorator);


// review Controller
Router.post('/add/review', auth, reviewController().addReview);
Router.post('/delete/review', auth, reviewController().deleteReview);
Router.post('/update/review', auth, reviewController().updateReview);
Router.post('/all/reviews', [auth, vendor], reviewController().getServiceReview);


// order
Router.post('/book/service', auth, orderController().saveOrder);
Router.get('/allorders/customer', auth, orderController().getUserOrders);
Router.post('/getOrderDetail', orderController().getSingleOrder);
Router.post('/update/order', [auth], orderController().updateOrder);
Router.post('/update/orderStatus', [auth, vendor], orderController().updateOrderStatus);
Router.post('/delete/order', [auth], orderController().deleteOrder);
// Router.post('/update/order-dates', [auth], orderController().updateOrderAndDates);

Router.post('/update/basic-info', [auth, vendor], commonController().updateBusinessInfo);
Router.post('/update/package-info', [auth, vendor], commonController().updatePackageInfo);
Router.post('/delete/gallery-picture', [auth, vendor], commonController().deleteGalleryPicture);

Router.get('/dummy-calculation', commonController().dummyCalculation);
Router.get('/totalService', countServiceControlller().index);

Router.patch('/complete/order/:id', [auth, vendor], orderController().completeOrder);


// admin routes
Router.get('/get-all-data', [auth, admin], adminController().index);
Router.patch('/approve-service/:id', [auth, admin], adminController().approveService);
Router.delete('/delete-service/:id', [auth, admin], adminController().deleteService);

module.exports = Router;