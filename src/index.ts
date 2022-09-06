import express, { Request } from 'express';
import multer, { diskStorage } from 'multer';
import bodyParser from 'body-parser';
import path from 'path';
import uniqid from 'uniqid';

import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import notFoundRoutes from './routes/notFound';
import { init } from './socket';
import { StatusError } from './models';

import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from './graphql/schema';
import graphqlResolver from './graphql/resolvers';
import { GraphQLFormattedError } from 'graphql';
const cors = require('cors');

const app = express();

const fileStorage = diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'dist/images');
	},
	filename: (req, file, callback) => {
		callback(null, `${uniqid()}-${file.originalname}`);
	}
});

const fileFilter = (req: Request, file: any, callback: Function) => {
	let ok = /^image\/(png|jpg|jpeg)/.test(file.mimetype);
	callback(null, ok);
};

app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(userRoutes);
app.use(chatRoutes);

const headers = (req, res, next) => {
	const origin =
		req.headers.origin == 'http://localhost:3000'
			? 'http://localhost:3000'
			: 'https://mywebsite.com';
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
};

app.use(
	'/graphql',
	cors(),
	headers,
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		customFormatErrorFn(error: GraphqlError) {
			if (!error.originalError) {
				return error;
			}
			const data = error.originalError.data || [];
			const message = error.originalError.message || 'An error has ocurred';
			const status = error.originalError.status || 500;
			return { message, status, data };
		}
	})
);

app.use(notFoundRoutes);

/*
    ERROR HANDLER
*/
app.use((error: any, req: any, res: any, next: any): void => {
	const statusError = error as StatusError;
	const status = statusError.status;
	const message = statusError.message;
	res.status(status).json({ message });
	return;
});

const port = 8080;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
	const io = init(server);
	io.on('connection', (socket: SocketData) => {
		console.log('Client connected!');
	});
});
