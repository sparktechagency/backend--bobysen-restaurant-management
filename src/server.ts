import { Server, createServer } from "http";
import mongoose from "mongoose";
import qrcode from "qrcode-terminal";
import Whatsapp from "whatsapp-web.js";
import app from "./app";
import config from "./app/config";
import initializeSocketIO from "./socketIo";
const { Client, LocalAuth } = Whatsapp;
export const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
      console.log(`app is listening on port ${ config.ip} ${config.port}`);
    });
    io.listen(Number(config.socket_port));
    console.log(`Socket is listening on port ${config.socket_port}`);
  } catch (err) {
    console.log(err);
  }
}

function whatSappServe() {
  client.on("qr", (qr) => {
    // Generate and display the QR code in the terminal
    qrcode.generate(qr, { small: true });
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
