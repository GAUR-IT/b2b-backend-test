// src/subscribers/order-placed.ts

import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION)
    const query = container.resolve("query")

    // Retrieve order details
    const { data: [order] } = await query.graph({
        entity: "order",
        fields: [
            "id",
            "display_id",
            "email",
            "currency_code",
            "total",
            "items.*",
            "shipping_address.*",
            "billing_address.*",
            "shipping_methods.*",
            "customer.*",
            "total",
            "subtotal",
            "discount_total",
            "shipping_total",
            "tax_total",
            "item_subtotal",
            "item_total",
            "item_tax_total"
        ],
        filters: { id: data.id },
    })

    console.log("Order details:", order)
    console.log("===========================")
    console.log("Order details:", { order })


    const recipients = [
        "gauritcanada@gmail.com",
        "techchat.sup@gmail.com"
    ]

    // Send the email using SendGrid
    await notificationModuleService.createNotifications(
        recipients.map(email => ({
            to: email,
            channel: "email",
            template: "d-371916d4a5ab4d91879b19ab15466a8a", // Replace with your SendGrid template ID
            data: { order },
        })))
}

export const config: SubscriberConfig = {
    event: "order.placed",
}