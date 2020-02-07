import packageJSON from "./package.json";
import { generateRollupConfiguration } from "vis-dev-utils";

export default generateRollupConfiguration({
  header: { name: "vis-uuid" },
  libraryFilename: "vis-uuid",
  entryPoint: "./src",
  packageJSON,
  tsconfig: "tsconfig.json"
});
