"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
/*
    404 NOT FOUND CONTROLLER
*/
const notFound = (req, res, next) => {
    res.status(404).json({ message: 'Not Found, Sorry.' });
    return;
};
exports.notFound = notFound;
