export interface BucketItem {
    item: {
        item_id: string,
        price_including_taxes: {
            code: string,
            minor_unites: number,
            decimals: number
        },
        cover_picture: Image,
        logo_picture: Image,
        display_name: string,
        items_available: number,
        new_item: boolean
    }
}

export interface Image {
    current_url: string
}

export interface BucketResponse {
    mobile_bucket: {
        items: BucketItem[],
    }
}