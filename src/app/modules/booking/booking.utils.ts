import moment from "moment";
import { MessageMedia } from "whatsapp-web.js";
import { client } from "../../../server";

export const generateBookingNumber = () => {
  // Get the current timestamp
  const timestamp = Date.now();
  // Use the last 6 digits of the timestamp
  const seed = timestamp % 1000000;
  // Use the seed to generate a random number
  const randomNumber = Math.floor(seed + Math.random() * (999999 - seed));
  return randomNumber;
};

export const sendMessageToNumber = async (
  number: string,
  message: string,
  mediaPath?: string // Optional media path parameter
): Promise<void> => {
  try {
    // Format the number to include the country code, if not already
    const formattedNumber = number.includes("@c.us")
      ? number
      : `${number}@c.us`;

    if (mediaPath) {
      // Load the media file
      const media = MessageMedia.fromFilePath(mediaPath);
      await client.sendMessage(formattedNumber, media, { caption: message });
      console.log(`Media message sent to ${number}: ${message}`);
    } else {
      await client.sendMessage(formattedNumber, message);
      console.log(`Message sent to ${number}: ${message}`);
    }
  } catch (error) {
    console.error(`Failed to send message to ${number}`, error);
  }
};
export const calculateEndTime = (arrivalTime: string) =>
  moment(arrivalTime, "HH:mm").add(2, "hours").format("HH:mm");
