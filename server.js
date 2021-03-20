import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import env from './env.js';
import usersRoute from './app/routes/usersRoute.js';


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', usersRoute);




app.listen(env.port).on('listening', () => {
  console.log(`🚀 are live on ${env.port}`);
});


export default app;

