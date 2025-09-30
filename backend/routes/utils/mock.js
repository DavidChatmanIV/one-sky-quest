import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// toggle mocks via env; default true if no DB yet
const USE_MOCKS = process.env.USE_MOCKS !== "false";

export async function loadMock(name, fallback = []) {
  if (!USE_MOCKS) return fallback;
  try {
    const file = path.resolve(
      __dirname,
      "..",
      "..",
      "data",
      `${name}.mock.json`
    );
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    // If mock missing, just return fallback so the app still boots
    return fallback;
  }
}
