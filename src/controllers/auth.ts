import { Request, Response, NextFunction } from 'express';
import { StatusError } from '../models';
import jwt from 'jsonwebtoken';
const { verify } = jwt;

interface ControllerFunction {
	(req: Request, res: Response, next: NextFunction): void;
}

/*
    IS AUTH CONTROLLER
*/
export const isAuth: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// 1. Get auth header
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const statusError = new StatusError('Unauthorized action', 401);
		next(statusError);
	}

	// 2. obtain token
	// @ts-ignore
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = verify(token, 'toremsoftware');
	} catch (error) {
		const statusError = new StatusError('Unauthorized action', 401);
		next(statusError);
	}

	// 3. verify
	if (!decodedToken) {
		const statusError = new StatusError('Unauthorized action', 401);
		next(statusError);
	}

	// @ts-ignore
	req.userId = decodedToken.userId;
	next();
};
