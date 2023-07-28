require(`dotenv`).config();
require(`express-async-errors`);

const express = require(`express`);
const app = express();

const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const { authenticateUser } = require(`./middlewares/authentication`);
const morgan = require('morgan');
const cors = require(`cors`);
const crypto = require(`crypto`);
const connectDB = require(`./db/connect`);

const authRouter = require(`./routes/authRoutes`);
const usersRouter = require(`./routes/usersRoutes`);
const jobsRouter = require(`./routes/jobsRoutes`);

app.use(express.json());
app.use(morgan(`tiny`));
app.use(cors());

// ROUTES
app.get(`/`, (req, res) => {
  res.send(`Dynamic Job Finder API`);
});

app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/users`, authenticateUser, usersRouter);
app.use(`/api/v1/jobs`, jobsRouter);

// PAYSTACK WEBHOOK
app.post(`/api/v1/webhook-url`, (req, res) => {
  const event = req.body;
  console.log(event);
  res.status(200).json({ event });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}....`);
  });
};

start();
