import { Request, Response, NextFunction } from 'express';
import database from '../database/fetchDatabase';
import { User, StatusError } from '../models';
import jwt from 'jsonwebtoken';
import { getIO } from '../socket';

const { sign } = jwt;

interface ControllerFunction {
	(req: Request, res: Response, next: NextFunction): void;
}

/*
    USERS CONTROLLERS
*/
export const getUsers: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const users = database.getUsers();
		const visibleUsers = users.map(
			({ userId, name, lastName, email, image }) => {
				return {
					userId,
					name,
					lastName,
					email,
					image
				};
			}
		);
		res.status(200).json(visibleUsers);
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

export const getUser: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId } = req.params;
	try {
		const user = database.getUser(userId);
		if (user) {
			res.status(200).json(user);
			return;
		}
		res.status(404).json({ message: 'User not found' });
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

export const deleteUser: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId } = req.params;
	try {
		// @ts-ignore
		if (!req.userId || req.userId !== userId) {
			res.status(401).json({ message: 'Unauthorized action' });
			return;
		}
		database.deleteUser(userId);
		// @ts-ignore
		getIO().emit('users', { action: 'delete', userId });
		res.status(201).json({ message: 'User deleted successfully' });
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

export const createUser: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { name, lastName, email, password } = req.body;
	const image = req.file?.path;
	if (!image) {
		res.status(422).json({ message: 'Missing image file' });
		return;
	}
	// could be done with express-validator
	if (validAttributes(name, lastName, email, password, image)) {
		const user: User = new User(name, lastName, email, password, image);
		try {
			if (!database.getUserByEmail(email)) {
				database.createUser(user);
				// @ts-ignore
				getIO().emit('users', { action: 'register', userId: user.userId });
				res.status(201).json({ message: 'User registered successfully' });
				return;
			}
			res.status(409).json({ message: 'User already registered' });
			return;
		} catch (error) {
			const statusError = new StatusError('Error while fetching data', 500);
			next(statusError);
		}
	} else {
		res.status(422).json({
			message: 'Bad Request: Make sure all attributes and their types are OK',
			attributes: { name, lastName, email, password }
		});
	}
};

export const logInUser: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { email, password } = req.body;
	if (validAttributes('', '', email, password, '')) {
		try {
			const ok = database.existsUser(email, password);
			if (ok) {
				const { userId } = database.getUserByEmail(email) as User;
				const token = sign(
					{
						userId
					},
					'toremsoftware',
					{ expiresIn: '1h' }
				);
				res
					.status(201)
					.json({ message: 'Logged In successfully', userId, token });
				return;
			}
			res.status(401).json({ message: 'Incorrect email or password' });
		} catch (error) {
			const statusError = new StatusError('Error while fetching data', 500);
			next(statusError);
		}
	} else {
		res.status(422).json({
			message: 'Bad Request: Make sure all attributes and their types are OK',
			attributes: { email, password }
		});
	}
};

const validAttributes = (
	name: any,
	lastName: any,
	email: any,
	password: any,
	image: any
) => {
	return (
		typeof name == 'string' &&
		typeof lastName == 'string' &&
		typeof email == 'string' &&
		typeof password == 'string' &&
		typeof image == 'string'
	);
};
