import { 
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostTerm } from "./validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "admin/terms",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostTerm),
      ],
    },
    {
      matcher: "admin/terms/:id",
      method: "GET",
      middlewares: [
        
      ],
    },
  ],
})