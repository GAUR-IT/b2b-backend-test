//create api for the new linked table
//then add the things to frontend to make it work

import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { updateCustomersWorkflow } from "@medusajs/medusa/core-flows";
import z from "zod";
import { UpdateCustomerTermSchema } from "./validators";


type UpdateTermsType = z.infer<typeof UpdateCustomerTermSchema>

// GET: Retrieve customers with their associated payment terms
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const customer_id = req.params.id;
  const query = req.scope.resolve("query");

  const { data: customers } = await query.graph({
    entity: "customer",
    filters: { id: customer_id },
    fields: ["id", "payment_term.*"],
  });  

  if (!customers) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.status(200).json({ customer: customers });
};

export const POST = async (req: AuthenticatedMedusaRequest<UpdateTermsType>, res: MedusaResponse) => {
  const customer_id  = req.params.id;
  const { additional_data } = req.validatedBody

  // 2️⃣ Trigger Medusa update workflow + your custom hook
  const { result } = await updateCustomersWorkflow(req.scope)
    .run({
      input: {
        selector: { id: customer_id },
        update: {},
        additional_data
      },
    });

  // 3️⃣ Return the updated customer
  res.status(200).json({ "Success": true  })
}

