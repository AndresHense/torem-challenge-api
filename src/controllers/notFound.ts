import { Request, Response, NextFunction } from 'express';

interface ControllerFunction {
	(req: Request, res: Response, next: NextFunction): void;
}

/*
    404 NOT FOUND CONTROLLER
*/
export const notFound: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	res.status(404).json({ message: 'Not Found, Sorry.' });
	return;
};
