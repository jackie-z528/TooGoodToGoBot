import { CookieJar } from "tough-cookie";
import { Db } from "../DB/db";
import { EmailAuthResponse, PollAuthResponse } from "./models/Auth";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support"

const BASE_AUTH_URL = "auth/v3";

export class TooGoodToGoClient {
    private client: AxiosInstance;
    private db: Db;

    constructor() {
        this.client = wrapper(axios.create({
            jar: new CookieJar(), baseURL: "https://apptoogoodtogo.com/api",
            headers: {
                "User-Agent":
                    "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
                "Content-Type": "application/json",
                Accept: "",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip",
            }, responseType: "json"
        }))
        this.db = new Db();
    }

    public async login(email: string): Promise<void> {
        const emailAuthResponse: EmailAuthResponse = await this.client.post(`${BASE_AUTH_URL}/authByEmail`, { email, device_type: "IOS" }).then((resp) => resp.data);
        const { polling_id } = emailAuthResponse;
        return this.db.setPollingId(polling_id);
    }

    public async continueLogin(email: string): Promise<void> {
        const polling_id = await this.db.getPollingId();
        const pollAuthResponse: PollAuthResponse = await this.client
            .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
                request_polling_id: polling_id,
                email,
                device_type: "IOS"
            }).then((resp) => resp.data);
        const { access_token, refresh_token } = pollAuthResponse;
        await Promise.all([this.db.setAccessToken(access_token), this.db.setRefreshToken(refresh_token)])
    }
}
