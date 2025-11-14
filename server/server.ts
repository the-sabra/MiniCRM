import express, { Application } from 'express';
import { connect } from './config/db.js';
import * as dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.handler.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app: Application = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 150 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

const port = process.env.PORT || 3000;

// Middleware for logging HTTP requests
app.use(morgan('combined'));

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/uploads', express.static('public/uploads'));

app.use(cors({
    origin: "*"
}));

app.use(limiter);

app.use(helmet());


// Register routes
app.use('/', routes);

// make response in json if route not found
app.use(( _req, res, _next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler should be last
app.use(errorHandler);

app.listen(port, async () => {
    await connect();
    console.error(`Server running at http://localhost:${port}`);
    console.error(`Health check: http://localhost:${port}/health`);
});
