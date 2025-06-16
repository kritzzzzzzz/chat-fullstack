import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

const ACCESS_CODE = "SMSO21";
const authorizedSockets = new Set();
const messages = [];

io.on("connection", (socket) => {
  socket.on("auth", (code) => {
    if (code === ACCESS_CODE) {
      authorizedSockets.add(socket.id);
      socket.emit("chat history", messages);
    } else {
      socket.emit("unauthorized");
    }
  });

  socket.on("chat message", (msg) => {
    if (!authorizedSockets.has(socket.id)) {
      socket.emit("unauthorized");
      return;
    }
    messages.push(msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    authorizedSockets.delete(socket.id);
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
