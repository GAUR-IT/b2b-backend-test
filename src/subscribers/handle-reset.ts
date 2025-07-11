import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPasswordTokenHandler({
  event: { data: {
    entity_id: email,
    token,
    actor_type,
  } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const urlPrefix = actor_type === "customer" ? 
    process.env.STORE_CORS : 
    `${process.env.ADMIN_CORS}/app`

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "d-1368c796bded4ef784ce44911de7d78c",
    data: {
      // a URL to a frontend application
      url: `${urlPrefix}/reset-password?token=${token}&email=${email}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}