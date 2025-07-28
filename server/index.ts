import express, { type Request, Response, NextFunction } from "express";
import http from "http"; // Import the http module
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
// Create an HTTP server instance. This is good practice and gives more control.
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Monkey-patch res.json to capture the response body for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args] as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // The registerRoutes function in your project expects only one argument.
  await registerRoutes(app);

  // Generic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(err); // Log the full error to the console

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // Setup Vite for development or serve static files for production
  // This should come after API routes and error handlers
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Define the port, defaulting to 5000
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // *** FIX APPLIED HERE ***
  // Use '0.0.0.0' for production (like on Render) and 'localhost' for development.
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
 
  server.listen(port, host, () => {
    // Use the host variable in the log for accuracy.
    log(`Server running at http://${host}:${port}`);
  });

})();
