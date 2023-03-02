import { CookieJar } from "tough-cookie";
import { Db } from "../DB/db";
import { EmailAuthResponse, PollAuthResponse, RefreshResponse } from "./models/Auth";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support"
import { BucketResponse } from "./models/Bucket";
import got, { Got } from "got";

const BASE_AUTH_URL = "auth/v3";
const BASE_URL = "https://apptoogoodtogo.com/api/"

export class TooGoodToGoClient {
    private client: AxiosInstance;
    private gotClient: Got;
    private db: Db;

    constructor() {
        this.client = wrapper(axios.create({
            jar: new CookieJar(), baseURL: BASE_URL,
            headers: {
                "User-Agent":
                    "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
                "Content-Type": "application/json",
                Accept: "",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip",
            }
        }))

        // Got complains when called in serverless server, but is useful to appear more human like in captcha sensitive requests
        this.gotClient = got.extend({
            cookieJar: new CookieJar(),
            prefixUrl: "https://apptoogoodtogo.com/api/",
            headers: {
                "User-Agent":
                    "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
                "Content-Type": "application/json",
                Accept: "",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip",
            },
            responseType: "json",
            resolveBodyOnly: true,
            retry: {
                limit: 2,
                methods: ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"],
                statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
            }
        })

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
        const { user_id } = pollAuthResponse.startup_data.user;
        await Promise.all([this.db.setAccessToken(access_token), this.db.setRefreshToken(refresh_token), this.db.setUserId(user_id)])
    }

    public async refreshToken(): Promise<void> {
        const refreshToken = await this.db.getRefreshToken();
        const refreshResponse: RefreshResponse = await this.gotClient.post(`${BASE_AUTH_URL}/token/refresh`, { json: { refresh_token: refreshToken } }).json();
        const { access_token, refresh_token } = refreshResponse;
        await Promise.all([this.db.setAccessToken(access_token), this.db.setRefreshToken(refresh_token)]);
    }

    public async getFavorites(): Promise<void> {
        const accessToken = await this.db.getAccessToken();
        const userId = await this.db.getUserId();
        const bucketResponse: BucketResponse = await this.client.post(`item/v8/`, {
            favorites_only: true,
            user_id: userId,
            origin: {
                latitude: 0,
                longitude: 0
            },
            radius: 1
        }, { headers: { Authorization: `Bearer ${accessToken}` } }).then(resp => resp.data);
        console.log(bucketResponse)
    }
}
