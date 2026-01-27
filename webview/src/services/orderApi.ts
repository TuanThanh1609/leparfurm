// NocoDB API service for saving orders
// Note: In production, API calls should go through a backend proxy to hide API keys

// TODO: Enable when API token is configured
// const NOCODB_API_URL = "https://cloud.nocodb.com/api/v2/tables/mi3jks9a3uqy7wr/records";

// Generate unique order code
function generateOrderCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LP-${timestamp}-${random}`;
}

export interface OrderData {
    productId: string;
    productTitle: string;
    productPrice: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress: string;
    note?: string;
}

export interface OrderResult {
    success: boolean;
    orderCode?: string;
    error?: string;
}

export async function submitOrder(data: OrderData): Promise<OrderResult> {
    const orderCode = generateOrderCode();

    const record = {
        "ID": orderCode,
        "Code": orderCode,
        "Status": "new",
        "Status Name": "Đơn mới",
        "Customer Name": data.customerName,
        "Customer Phone": data.customerPhone,
        "Total Amount": data.productPrice,
        "Created At": new Date().toISOString(),
        "Branch Name": "Le Parfum Webview",
        "Sales Channel": "Scent Matchmaker",
        "Products": JSON.stringify([{
            id: data.productId,
            title: data.productTitle,
            price: data.productPrice,
            quantity: 1
        }]),
        "Raw Data": JSON.stringify({
            customer: {
                name: data.customerName,
                phone: data.customerPhone,
                email: data.customerEmail || "",
                address: data.customerAddress
            },
            note: data.note || "",
            source: "scent-matchmaker-webview",
            createdAt: new Date().toISOString()
        })
    };

    try {
        // For demo/development: Log the order (actual API requires auth token)
        console.log("📦 Order to submit:", record);

        // TODO: Uncomment when API token is configured
        // const response = await fetch(NOCODB_API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "xc-token": import.meta.env.VITE_NOCODB_API_TOKEN || ""
        //     },
        //     body: JSON.stringify(record)
        // });

        // if (!response.ok) {
        //     throw new Error(`API error: ${response.status}`);
        // }

        // Simulate success for now
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            orderCode: orderCode
        };
    } catch (error) {
        console.error("Failed to submit order:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
