import { updateCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { updateTermsWorkflow } from "../terms/workflows/update-customer-payment-term";

updateCustomersWorkflow.hooks.customersUpdated(
  async ({ customers, additional_data }, { container }) => {
    const wf = updateTermsWorkflow(container);

    for (const customer of customers) {
      const terms_id = additional_data?.terms_id
      if (typeof terms_id !== "string" && terms_id !== null && terms_id !== undefined) {
        throw new Error("Invalid terms_id in additional_data")
      }
      await wf.run({
        input: {
          customer,
          additional_data: { terms_id },
        },
      });
    }
  }
);