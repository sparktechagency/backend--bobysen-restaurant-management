import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";

export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: CountryCode = "MU"
) => {
  const number = parsePhoneNumberFromString(phoneNumber, countryCode);
  return number && number.isValid() ? true : false;
};
