/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
const app: Application = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//parsers
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'https://mybookatable.mu',
      'https://bookatable.mu',
      'https://socket.bookatable.mu',
      // 'http://localhost:5173',
      // 'http://localhost:5174',
      // 'http://localhost:3000',
      'https://reservation.bookatable.mu',
    ], // Allow all originss
    // credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
// application routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
