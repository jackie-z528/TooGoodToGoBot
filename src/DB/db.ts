import AWS from "aws-sdk";
import { Env } from "../Env";
import { throwItemNotFound } from "./error";
import { Item } from "./models/Item";

export class Db {
    private dynamoInstance: AWS.DynamoDB.DocumentClient;
    private tableName: string;
    constructor() {
        AWS.config.update({ region: Env.AWS_REGION })
        this.dynamoInstance = new AWS.DynamoDB.DocumentClient();
        this.tableName = Env.TABLE_NAME;
    }

    public setPollingId = async (pollingId: string): Promise<void> => this.putItem({ key: "pollingId", value: pollingId });

    public getPollingId = async (): Promise<string> => (await this.getItem("pollingId")).value;

    public setAccessToken = async (accessToken: string): Promise<void> => this.putItem({ key: "accessToken", value: accessToken });

    public getAccessToken = async (): Promise<string> => (await this.getItem("accessToken")).value;

    public setRefreshToken = async (refreshToken: string): Promise<void> => this.putItem({ key: "refreshToken", value: refreshToken });

    public getRefreshToken = async (): Promise<string> => (await this.getItem("refreshToken")).value;

    private async getItem(key: string): Promise<Item> {
        const params = {
            TableName: this.tableName,
            Key: {
                key
            }
        }
        const item = await this.dynamoInstance.get(params).promise().then((item) => item.Item);
        return item ? item.Item : throwItemNotFound();
    }

    private async putItem(item: Item): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: item
        }
        await this.dynamoInstance.put(params).promise()
    }

}