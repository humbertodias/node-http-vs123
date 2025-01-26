import spdy from "spdy";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const port = process.env.PORT || 3002;

// Get the directory name of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Define a basic route
app.get("/", (req, res) => {
  res.status(200).json({ message: "ok" });
});

// Serve static files from the 'img' directory
app.use("/img", express.static("img"));

// Load user-provided SSL certificate and key dynamically
const certPath = process.env.SSL_CERT_PATH || `${__dirname}/ssl/server.crt`;
const keyPath = process.env.SSL_KEY_PATH || `${__dirname}/ssl/server.key`;

const options = {
  key: fs.readFileSync(resolve(keyPath)), // Resolve key path dynamically
  cert: fs.readFileSync(resolve(certPath)), // Resolve cert path dynamically
};

// Create the HTTP/2 server with SPDY and start listening
spdy.createServer(options, app).listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  } else {
    console.log(`Listening on https://localhost:${port}`);
  }
});
