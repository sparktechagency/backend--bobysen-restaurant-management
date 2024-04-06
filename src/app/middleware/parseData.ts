import catchAsync from "../utils/catchAsync.js";
const parseData = () => {
  return catchAsync(async (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  });
};
export default parseData;
