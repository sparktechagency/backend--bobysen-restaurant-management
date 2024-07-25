import { Server, createServer } from "http";
import mongoose from "mongoose";
import Whatsapp from "whatsapp-web.js";
import app from "./app";
import config from "./app/config";
import initializeSocketIO from "./socketIo";
const { Client, LocalAuth } = Whatsapp;
export const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({
    clientId: "clientId",
  }),
});
let server: Server;
export const io = initializeSocketIO(createServer(app));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(Number(config.port), config.ip as string, () => {
      console.log(`app is listening on port ${config.port}`);
    });
    io.listen(Number(config.socket_port));
    console.log(`Socket is listening on port ${config.socket_port}`);
  } catch (err) {
    console.log(err);
  }
}

function whatSappServe() {
  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", (msg) => {
    if (msg.body === "!ping") {
      msg.reply("pong");
    }
  });

  client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  });

  client.initialize().catch((err) => {
    console.error("Error initializing WhatsApp client", err);
  });
}
// whatSappServe();
main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
