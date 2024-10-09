import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/github-webhook", async (req, res) => {
  console.log(req.body);
  res.send("Hello World");
});

const PORT = 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // ! exit gracefully
    console.log(error);
    process.exit(1);
  }
};

startServer();
