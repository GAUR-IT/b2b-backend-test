import { Module } from "@medusajs/framework/utils";
import TermsModuleService from "./service";

export const TERMS_MODULE = "terms";

export default Module(TERMS_MODULE, {
  service: TermsModuleService,
});
