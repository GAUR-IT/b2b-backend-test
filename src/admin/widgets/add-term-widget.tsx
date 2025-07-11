import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types"
import { Container, Heading, Input, Text, Button } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"
import { useState } from "react"

const CustomertermWidget = ({
  data: customer,
}: DetailWidgetProps<AdminCustomer>) => {
  const url = `/admin/terms/customer-terms/${customer?.id}`

  // Fetch current customer term (on load)
  const { data: queryResult, isLoading, error, refetch } = useQuery({
    queryFn: () =>
      sdk.client.fetch(url)
        .then((json) => json)
        .catch((err) => {
          console.error("Fetch error:", err)
          return null
        }),
    queryKey: ["customerTerms", customer?.id],
  })

  // All terms - only fetched after user starts typing
  const [allTerms, setAllTerms] = useState<any[]>([])
  const [hasFetchedTerms, setHasFetchedTerms] = useState(false)
  const [loadingTerms, setLoadingTerms] = useState(false)

  const [term, setTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // When user types, fetch all terms if not already fetched
  const handleInputChange = (e) => {
    setTerm(e.target.value)
    if (!hasFetchedTerms && !loadingTerms) {
      setLoadingTerms(true)
      sdk.client.fetch("/admin/terms")
        .then((json) => setAllTerms(json?.payment_term || []))
        .catch(() => setAllTerms([]))
        .finally(() => setHasFetchedTerms(true))
    }
  }

  const currentTerm = queryResult?.customer?.[0]?.payment_term?.term ?? ""

  const handleSetTerm = async () => {
    setLoading(true)
    setMessage(null)
    try {
      let found = allTerms?.find((t: any) => String(t.term) === String(term))
      let termId = found?.id

      if (!termId) {
        const createRes = await sdk.client.fetch("/admin/terms", {
          method: "POST",
          body: { term: term },
        })
        termId = createRes?.payment_term?.id
      }

      if (!termId) {
        setMessage("Failed to create or find payment term.")
        setLoading(false)
        return
      }

      await sdk.client.fetch(`/admin/terms/customer-terms/${customer.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { additional_data: { terms_id: termId } },
      })

      setMessage("Payment term set successfully!")
      setTerm("")
      await refetch({ force: true })
    } catch (err) {
      setMessage("Error setting payment term.")
      console.error(err)
    }
    setLoading(false)
  }

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Payment Term</Heading>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            Term
          </Text>
          <Text size="small" leading="compact">
            Loading...
          </Text>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Payment Term</Heading>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            Term
          </Text>
          <Text size="small" leading="compact">
            Error loading terms, please try again later.
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Payment Term</Heading>
        <div className="flex justify-end">
          <Button
            onClick={handleSetTerm}
            disabled={loading || !term}
            variant="primary"
          >
            {loading ? "Setting..." : "Set Terms"}
          </Button>
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Term
        </Text>
        <Input
          type="number"
          min={1}
          step={1}
          className="whitespace-pre-line text-pretty"
          placeholder={
            currentTerm
              ? `Current: ${currentTerm} days (To update: Enter new payment term here and press "Set terms")`
              : "Enter new payment term"
          }
          value={term}
          onChange={handleInputChange}
          onInput={e => {
            // Remove non-digits and leading zeros
            const input = e.target as HTMLInputElement
            let val = input.value.replace(/[^0-9]/g, "")
            val = val.replace(/^0+/, "")
            input.value = val
          }}
          disabled={loading}
        />
      </div>
      {message && (
        <div className="flex justify-end px-6 py-4">
          <Text size="small" className="text-ui-fg-success">{message}</Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomertermWidget
