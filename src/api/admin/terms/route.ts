import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createPaymentTermWorkflow } from "../../../workflows/terms/workflows/create-payment-term"
import { PostTerm } from "./validators"
import z from "zod"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type PostTermType = z.infer<typeof PostTerm>


export const POST = async (
  req: AuthenticatedMedusaRequest<PostTermType>,
  res: MedusaResponse
) => {
  const { term } = req.validatedBody || req.body 
  if (!term) {
    return res.status(400).json({ message: "Missing 'term' in request body raaaa" });
  }

  const { result: paymentTerm } = await createPaymentTermWorkflow(req.scope).run({
    input: { term },
  })

  res.json({ payment_term: paymentTerm })
}

//Gets all payment terms
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: paymentTerm } = await query.graph({
    entity: "payment_term",
    fields: ["*"]
  })
  if (!paymentTerm || paymentTerm.length === 0) {
    return res.status(404).json({ message: "Payment term not found" })
  }
  res.json({ payment_term: paymentTerm })

}


