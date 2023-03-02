import axios, { AxiosInstance } from "axios";
import { Db } from "../DB/db";

const BASE_AUTH_URL = "/auth/v3";

export class TooGoodToGoClient {
    private client: AxiosInstance;
    private db: Db;

    constructor() {
        this.client = axios.create({
            baseURL: "https://apptoogoodtogo.com/api",
            headers: { "User-Agent": "TooGoodToGo/23.2.10 (7033) (iPhone/iPhone 14; iOS 16.2; Scale/3.00.iOS)" },
        });

        this.db = new Db();
    }

    public async login(email: string): Promise<void> {
        await this.client
            .post(`${BASE_AUTH_URL}/authByEmail`, { email, device_type: "IOS" })
            .then(async (resp) => {
                const { polling_id } = resp.data;
                try {
                    this.db.setPollingId(polling_id);
                } catch (err) {
                    throw new Error("Error saving polling id");
                }
            });
    }

    public async continueLogin(): Promise<void> {
        await this.client
            .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
                device_type: "IOS",
                //request_polling_id: this.pollingId,
            })
            .then((resp) => console.log(resp.data));
    }
}
