import TermsModule from "../modules/terms";
import CustomerModule from "@medusajs/medusa/customer";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  CustomerModule.linkable.customer,
  TermsModule.linkable.paymentTerm
)