import express from "express";
import { Webhooks } from "@octokit/webhooks";

const app = express();
const secret = "secret123"; // Replace with your actual secret

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello, World!");
});

const webhooks = new Webhooks({
  secret: secret,
});

async function handleWebhook(req, res, next) {
  const signature = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body);

  if (!(await webhooks.verify(body, signature))) {
    console.log("Invalid signature");
    res.status(401).send("Unauthorized");
    return;
  }

  next();
}

app.post("/github-webhook", handleWebhook, function (req, res) {
  let data = req.body;
  console.log(data);
  res.send("Received!");
});

const port = 5000;

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
