import AWS from "aws-sdk";
import { AttributeMap } from "aws-sdk/clients/dynamodb";
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

    public async setPollingId(pollingId: string): Promise<void> {
        const item = { key: "pollingId", value: pollingId };
        return this.putItem(item);
    }

    public async getPollingId(): Promise<string> {
        return (await this.getItem("pollingId")).value;
    }

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