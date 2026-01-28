// NocoDB API service for saving orders
// Endpoint: nocodb.smax.in - Order Table: m4fnwlzh8a3j5ne

const NOCODB_API_URL = "https://nocodb.smax.in/api/v2/tables/m4fnwlzh8a3j5ne/records";

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

    // Map to NocoDB table fields (m4fnwlzh8a3j5ne schema)
    const record = {
        "order_id": orderCode,
        "order_status": "new",
        "customer_name": data.customerName,
        "customer_phone": data.customerPhone,
        "customer_email": data.customerEmail || "",
        "customer_address": data.customerAddress,
        "total_amount": data.productPrice,
        "products": JSON.stringify([{
            id: data.productId,
            title: data.productTitle,
            price: data.productPrice,
            quantity: 1
        }]),
        "note": data.note || "",
        "source": "scent-matchmaker-webview"
    };

    try {
        const response = await fetch(NOCODB_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xc-token": import.meta.env.VITE_NOCODB_API_TOKEN || ""
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("NocoDB Error:", errorText);
            throw new Error(`Lỗi server (${response.status})`);
        }

        return {
            success: true,
            orderCode: orderCode
        };
    } catch (error) {
        console.error("Failed to submit order:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Lỗi không xác định"
        };
    }
}
