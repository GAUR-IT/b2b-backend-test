import { MedusaService } from "@medusajs/framework/utils";
import PaymentTerm from "./models/payment-term";

class TermsModuleService extends MedusaService ({
  PaymentTerm,
}) {}

export default TermsModuleService;