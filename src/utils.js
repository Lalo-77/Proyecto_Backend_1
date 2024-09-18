import { fileURLToPath } from "url";
import { dirname } from "path";

const _fileName = fileURLToPath(import.meta.url);
const _dirname = dirname(_fileName);

export default _dirname;


