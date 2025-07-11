import { CustomerDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createWorkflow, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createRemoteLinkStep, dismissRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { TERMS_MODULE } from "src/modules/terms";

export type UpdateTermsStepInput = {
  customer: CustomerDTO;
  additional_data?: { terms_id?: string | null };
};

export const updateTermsWorkflow = createWorkflow(
  "update-terms",
  (input: UpdateTermsStepInput) => {
    // @ts-ignore
    const result: { data: Array<{ payment_term: any; id: string; terms?: { id: string } }> } = useQueryGraphStep({
      entity: "customer",
      fields: ["payment_term.*"],
      filters: { id: input.customer.id },
    });

    // Now extract customer safely
    const customer = result.data[0];

    const updated = when(
      { input, customer },
      ({ input, customer }) =>
        input.additional_data?.terms_id !== (customer.payment_term?.id ?? null)
    ).then(() => {
      const newId = input.additional_data?.terms_id;
      const oldId = customer.payment_term?.id ?? null;
      if (newId) {
        createRemoteLinkStep([{
          [Modules.CUSTOMER]: { customer_id: customer.id },
          [TERMS_MODULE]: { payment_term_id: newId },
        }]);
      } if ( oldId && oldId !== newId ) {
        dismissRemoteLinkStep([{
          [Modules.CUSTOMER]: { customer_id: customer.id },
          [TERMS_MODULE]: { payment_term_id: oldId },
        }]);
      }
    });
    return new WorkflowResponse({ updated });

  }
);