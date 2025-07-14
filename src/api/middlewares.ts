import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { adminMiddlewares } from "./admin/middlewares";
import { storeMiddlewares } from "./store/middlewares";
import { validateAndTransformBody } from "@medusajs/framework/http";
import { UpdateCustomerTermSchema } from "./admin/terms/customer-terms/[id]/validators";
import { z } from "zod";



export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    ...storeMiddlewares,
    {
      matcher: "/store/customers/me",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          req.allowed = ["employee"];

          next();
        },
      ],
    },
    {
      matcher: "/admin/customers",
      method: ["POST"],
      additionalDataValidator: {
        payment_term_id: z.string().optional(),
      },
    },
    {
      matcher: "/admin/terms/customer-terms/:id",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(UpdateCustomerTermSchema),
      ],
    },
    {
      matcher: "/admin/terms/customer-terms/:id", 
      method: "GET",
      middlewares: [
        (req, res, next) => {
          req.allowed?.push("paymentTerm")
          next()
        },
      ],
    },
  ],
});
