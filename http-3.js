import { createServer } from "node:https"; // Use https module for SSL support
import { createApp, eventHandler, createRouter, toNodeListener } from "h3";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = process.env.PORT || 3003;

// Get the directory name of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = createApp();

// Define routes
const router = createRouter()
  .get(
    "/",
    eventHandler(() => ({ message: "ok" })) // Basic route returning a message
  )
  .get(
    "/img/:path",
    eventHandler((event) => 
      // Read and return an image from the 'img' folder
      fs.readFileSync(`img/${event.context.params.path}`)
    )
  );

app.use(router);

// SSL configuration with key and certificate
const options = {
  key: fs.readFileSync(`${__dirname}/ssl/server.key`), // Path to private key
  cert: fs.readFileSync(`${__dirname}/ssl/server.crt`), // Path to certificate
};

// Create an HTTPS server
createServer(options, toNodeListener(app)).listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error); // Log error if the server fails to start
    process.exit(1);
  } else {
    console.log(`Listening on https://localhost:${port}`); // Log the URL on successful start
  }
});
