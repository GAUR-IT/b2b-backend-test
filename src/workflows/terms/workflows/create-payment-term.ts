import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import TermsModuleService from "../../../modules/terms/service"
import { TERMS_MODULE } from "../../../modules/terms"

export type CreatePaymentTermInput = {
  term: string
}

// Step to create a payment term
export const createPaymentTermStep = createStep(
  "create-payment-term-step",
  async (input: CreatePaymentTermInput, { container }) => {
    const termsModuleService : TermsModuleService = container.resolve(
      TERMS_MODULE
    )

    const paymentTerm = await termsModuleService.createPaymentTerms(input)

    // Pass paymentTerm as both forward and backward value
    return new StepResponse(paymentTerm, paymentTerm)
  },
  // Compensation step (rollback) if you want (optional)
  async (paymentTerm, { container }) => {
    const termsModuleService: TermsModuleService = container.resolve("termsModuleService")
    if (paymentTerm?.id) {
      await termsModuleService.deletePaymentTerms(paymentTerm.id)
    }
  }
)



// The workflow itself
export const createPaymentTermWorkflow = createWorkflow(
  "create-payment-term",
  (input: CreatePaymentTermInput) => {
    const paymentTerm = createPaymentTermStep(input)
    return new WorkflowResponse(paymentTerm)
  }
)
