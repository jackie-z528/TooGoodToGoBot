import { getEnvString } from "./EnvUtils";

export const Env = {
    TABLE_NAME: getEnvString("TABLE_NAME", ""),
    AWS_REGION: getEnvString("AWS_REGION", ""),
}