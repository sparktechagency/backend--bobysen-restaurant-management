import axios from "axios";
import moment from "moment";
import config from "../../config";

export const generateBookingNumber = () => {
  // Get the current timestamp
  const timestamp = Date.now();
  // Use the last 6 digits of the timestamp
  const seed = timestamp % 1000000;
  // Use the seed to generate a random number
  const randomNumber = Math.floor(seed + Math.random() * (999999 - seed));
  return randomNumber;
};

// export const sendMessageToNumber = async (
//   number: string,
//   message: string,
//   mediaPath?: string // Optional media path parameter
// ): Promise<void> => {
//   try {
//     // Format the number to include the country code, if not already
//     const formattedNumber = number.includes("@c.us")
//       ? number
//       : `${number}@c.us`;

//     if (mediaPath) {
//       // Load the media file
//       const media = MessageMedia.fromFilePath(mediaPath);
//       await client.sendMessage(formattedNumber, media, { caption: message });
//       console.log(`Media message sent to ${number}: ${message}`);
//     } else {
//       await client.sendMessage(formattedNumber, message);
//       console.log(`Message sent to ${number}: ${message}`);
//     }
//   } catch (error) {
//     console.error(`Failed to send message to ${number}`, error);
//   }
// };
export const calculateEndTime = (arrivalTime: string) =>
  moment(arrivalTime, "HH:mm").add(2, "hours").format("HH:mm");
export const sendWhatsAppMessageToCustomers = async ({
  phoneNumbers,
  mediaUrl,
  bodyValues,
}: {
  phoneNumbers: string[];
  mediaUrl: string;
  bodyValues: string[];
}) => {
  const headers = {
    "Content-Type": "application/json",
    authkey: config.whatsapp_auth_key!,
  };

  const payload = {
    integrated_number: config.whatsapp_sms_number,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: "owner",
        language: {
          code: "en",
          policy: "deterministic",
        },
        namespace: null,
        to_and_components: [
          {
            to: phoneNumbers,
            components: {
              header_1: {
                type: "image",
                value: mediaUrl,
              },
              body_1: {
                type: "text",
                value: bodyValues[0],
              },
              body_2: {
                type: "text",
                value: bodyValues[1],
              },
              body_3: {
                type: "text",
                value: bodyValues[2],
              },
              body_4: {
                type: "text",
                value: bodyValues[3],
              },
              body_5: {
                type: "text",
                value: bodyValues[4],
              },
            },
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk",
      payload,
      { headers }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

// Example usage:
