const port = process.env.PORT || 3000;
import express from "express";
const app = express();

app.use("/", express.static("."));

app.listen(port, (error) => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log("Listening on port: http://localhost:" + port);
  }
});
