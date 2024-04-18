export const generateBookingNumber = () => {
  // Get the current timestamp
  const timestamp = Date.now();
  // Use the last 6 digits of the timestamp
  const seed = timestamp % 1000000;
  // Use the seed to generate a random number
  const randomNumber = Math.floor(seed + Math.random() * (999999 - seed));
  return randomNumber;
};
