import express from 'express'
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./config/.env") });

import { appController } from './src/app.controller.js';

const app = express();

const port = process.env.PORT || 3000;


appController(app,express);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))