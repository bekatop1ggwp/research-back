// const WebSocket = require("ws");
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const app = express();

// const ws = new WebSocket.Server({
//   port: 5050,
// });

// const test = new WebSocket.Server({
//   port: 5051,
// });

// app.use(cors());
// app.set("view engine", "ejs");

// let html = null;

// ws.on("connection", (socket) => {
//   socket.onmessage = (message) => {
//     const data = JSON.parse(message.data);

//     html = data.html;
//     // console.log(html);
//   };
// });

// app.get("/send", (req, res) => {
//   res.json({ message: "Hello I am send ws" });
// });

// test.on("connection", (socket) => {
//   console.log("some one ");
//   socket.send("HELLO ");
// });

// app.get("/", (req, res) => {
//   res.send(html || "Waiting for HTML content");
// });

// app.get("/test", (req, res) => {
//   res.render(__dirname + "/index.ejs", {
//     html,
//   });
// });

// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });
require("dotenv").config();
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.use(cors());
app.set("view engine", "ejs");

let html = null;

let answers = null;

wss.on("connection", (ws, request) => {
  const path = request.url;

  if (path === "/ws") {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      html = data.html;
      // console.log(html);
    };
  } else if (path === "/test") {
    console.log("Someone connected to '/test'");
    ws.send(
      JSON.stringify({
        message: "HELLO",
      })
    );
    ws.onmessage = (message) => {
      answers = {
        message: JSON.parse(message.data).message,
      };
      console.log(
        JSON.stringify({
          message: JSON.parse(message.data).message,
        })
      );
      ws.send(
        JSON.stringify({
          message: JSON.parse(message.data).message,
        })
      );
    };
  }
});

server.on("upgrade", (request, socket, head) => {
  const path = request.url;

  if (path === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else if (path === "/test") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

app.get("/send", (req, res) => {
  res.json(answers);
});

app.get("/", (req, res) => {
  res.send(html || "Waiting for HTML content");
});

app.get("/test", (req, res) => {
  res.render(__dirname + "/index.ejs", { html });
});

server.listen(process_env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
