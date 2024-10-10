import axios from "axios";
import fs from "fs";
import handlebars from "handlebars";
import httpStatus from "http-status";
import moment from "moment";
import path from "path";
import config from "../../config";
import AppError from "../../error/AppError";
import { sendEmail } from "../../utils/mailSender";
import { EmailContext } from "./booking.interface";
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
  buttonUrl,
}: {
  phoneNumbers: string[];
  mediaUrl: string;
  bodyValues: string[];
  buttonUrl: string;
}) => {
  const headers = {
    "Content-Type": "application/json",
    authkey: config.whatsapp_auth_key!,
  };

  // Dynamically create body components
  const components: any = {
    header_1: {
      type: "image",
      value: mediaUrl,
    },
  };

  bodyValues.forEach((value, index) => {
    components[`body_${index + 1}`] = {
      type: "text",
      value,
    };
  });
  components["button_1"] = {
    Subtype: "url",
    type: "text",
    value: buttonUrl,
  };
  const payload = {
    integrated_number: config.whatsapp_sms_number,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: "owner", // Adjust the template name as needed
        language: {
          code: "en",
          policy: "deterministic",
        },
        namespace: null,
        to_and_components: [
          {
            to: phoneNumbers,
            components,
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
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
export const sendWhatsAppMessageToVendors = async ({
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

  // Dynamically create the components object
  const components: any = {
    header_1: {
      type: "image",
      value: mediaUrl,
    },
  };

  bodyValues.forEach((value, index) => {
    components[`body_${index + 1}`] = {
      type: "text",
      value,
    };
  });

  const payload = {
    integrated_number: config.whatsapp_sms_number,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: "owner", // Template name as per the curl example
        language: {
          code: "en",
          policy: "deterministic",
        },
        namespace: null, // Keep it null as per the curl example
        to_and_components: [
          {
            to: phoneNumbers, // List of phone numbers
            components: components, // Components object created above
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
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
export const checkRestaurantAvailability = (
  restaurant: any,
  day: string,
  time: string
) => {
  const { openingTime, closingTime } = restaurant[day?.toLocaleLowerCase()];
  if (
    moment(time, "HH:mm").isBefore(moment(openingTime, "HH:mm")) ||
    moment(time, "HH:mm").isAfter(moment(closingTime, "HH:mm"))
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Restaurant is closed at ${time} on ${day}`
    );
  }
};
export const validateBookingTime = (
  restaurant: any,
  bookingTime: moment.Moment
) => {
  const isClosed = bookingTime.isBetween(
    moment(restaurant?.close?.from),
    moment(restaurant?.close?.to),
    undefined,
    "[]"
  );
  if (isClosed) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Restaurant is closed during this time. Please select another date."
    );
  }
};

export const sendReservationEmail = async (
  templateName: string,
  userEmail: string,
  subject: string,
  emailContext: EmailContext
) => {
  const templatePath = path.resolve(__dirname, `../../../../public.html`);

  fs.readFile(templatePath, "utf8", async (err, htmlContent) => {
    if (err) {
      console.error("Error reading the HTML file:", err);
      return;
    }

    try {
      const template = handlebars.compile(htmlContent);
      const htmlToSend = template(emailContext);

      // Send the email using your sendEmail utility
      await sendEmail(userEmail, subject, htmlToSend);
      console.log(`Email sent successfully to ${userEmail}`);
    } catch (compileError) {
      console.error("Error compiling the email template:", compileError);
    }
  });
};
export function generateTicketNumber() {
  const timestamp = Date.now().toString(); // Get the current timestamp as a string
  const uniqueTicket = timestamp.slice(-6); // Extract the last 6 digits of the timestamp
  return parseInt(uniqueTicket, 10); // Convert it back to an integer
}
