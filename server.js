import express from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, "dist"))); // 'dist' is the Vite build output

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

let messages = [];

io.on("connection", (socket) => {
  let authenticated = false;

  socket.on("auth", (code) => {
    if (code === "SMSO21") {
      authenticated = true;
      socket.emit("chat history", messages);
    } else {
      socket.emit("unauthorized");
    }
  });

  socket.on("chat message", (msg) => {
    if (!authenticated) return socket.emit("unauthorized");
    messages.push(msg);
    io.emit("chat message", msg);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
