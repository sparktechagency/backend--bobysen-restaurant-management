import fs from "fs";
import util from "util";
const unlinkSync = util.promisify(fs.unlink);
const deleteFile = async (path: string) => {
  const modifiedPath = `.${path}`;
  try {
    if (fs.existsSync(modifiedPath)) {
      await unlinkSync(modifiedPath);
    } else {
      console.log("not found");
    }
  } catch (err: any) {
    console.log(err);
    throw new Error(`Error deleting file: ${err.message}`);
  }
};

export { deleteFile };
export const createFileDetails = (folderName: string, filename: string) => {
  console.log(folderName, filename);
  return `/uploads/${folderName}/${filename}`;
};
