import express from "express";
import {onRequest} from "firebase-functions/v2/https";
import router from "./routes/router";

const port = 3000;

const app = express();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
app.use(express.json());

app.use(router);


exports.app = onRequest(app);
