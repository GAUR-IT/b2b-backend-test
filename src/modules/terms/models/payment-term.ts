import { model } from "@medusajs/framework/utils";

const PaymentTerm = model.define("payment_term", {
  id: model.id().primaryKey(),
  term: model.text(), 
});

export default PaymentTerm;