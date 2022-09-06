"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
/*
    USERS ROUTES
*/
router.get('/user', user_1.getUsers);
router.get('/user/:userId', user_1.getUser);
router.delete('/user/:userId', auth_1.isAuth, user_1.deleteUser);
router.post('/user/create', user_1.createUser);
router.post('/user/login', user_1.logInUser);
exports.default = router;
