import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { TERMS_MODULE } from "src/modules/terms";
import TermsModuleService from "src/modules/terms/service";


const DEFAULT_TERM_VALUE = "0"; // The default term value

createCustomersWorkflow.hooks.customersCreated(
  async ({ customers, additional_data }, { container }) => {
    const termsModuleService: TermsModuleService = container.resolve(TERMS_MODULE);

    // 1. If payment_term_id is provided, use it. Otherwise, ensure default exists and use its id.
    let paymentTermId: string | undefined = typeof additional_data?.payment_term_id === "string"
      ? additional_data.payment_term_id
      : undefined;

    if (!paymentTermId) {
      // Find or create the default payment term with term: "0"
      let paymentTerms = await termsModuleService.listPaymentTerms({ term: DEFAULT_TERM_VALUE });
      if (!paymentTerms?.length) {
        const created = await termsModuleService.createPaymentTerms({ term: DEFAULT_TERM_VALUE });
        paymentTermId = created.id;
      } else {
        paymentTermId = paymentTerms[0].id;
      }
    }

    // 2. Link each customer to the payment term
    const link = container.resolve("link");
    const links: LinkDefinition[] = customers.map((customer) => ({
      [Modules.CUSTOMER]: { customer_id: customer.id },
      [TERMS_MODULE]: { payment_term_id: paymentTermId },
    }));

    await link.create(links);
    return new StepResponse(links, links);
  },
  async (links, { container }) => {
    if (links?.length) {
      const link = container.resolve("link");
      await link.dismiss(links);
    }
  }
);