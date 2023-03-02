"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Env_1 = require("../Env");
const error_1 = require("./error");
class Db {
    constructor() {
        this.setPollingId = async (pollingId) => this.putItem({ key: "pollingId", value: pollingId });
        this.getPollingId = async () => (await this.getItem("pollingId")).value;
        this.setAccessToken = async (accessToken) => this.putItem({ key: "accessToken", value: accessToken });
        this.getAccessToken = async () => (await this.getItem("accessToken")).value;
        this.setRefreshToken = async (refreshToken) => this.putItem({ key: "refreshToken", value: refreshToken });
        this.getRefreshToken = async () => (await this.getItem("refreshToken")).value;
        aws_sdk_1.default.config.update({ region: Env_1.Env.AWS_REGION });
        this.dynamoInstance = new aws_sdk_1.default.DynamoDB.DocumentClient();
        this.tableName = Env_1.Env.TABLE_NAME;
    }
    async getItem(key) {
        const params = {
            TableName: this.tableName,
            Key: {
                key
            }
        };
        const item = await this.dynamoInstance.get(params).promise().then((item) => item.Item);
        return item ? item.Item : (0, error_1.throwItemNotFound)();
    }
    async putItem(item) {
        const params = {
            TableName: this.tableName,
            Item: item
        };
        await this.dynamoInstance.put(params).promise();
    }
}
exports.Db = Db;
