import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

const LoginWidget = () => {
    return (
        <Container className="shadow-none p-0 bg-transparent mt-3">
            <Heading className="ml-3 ">
                Powered by
            </Heading>

            <div
                className="flex items-center justify-center p-0 m-0 overflow-hidden"
                style={{ height: "60px" }}
            >
                {/* Light theme logo */}
                <img
                    src="https://minio-production-ca43.up.railway.app/b2b-medusa-files/B2B-Ready-light.png"
                    alt="B2B Ready light"
                    className="h-48 block dark:hidden"
                />
                {/* Dark theme logo */}
                <img
                    src="https://minio-production-ca43.up.railway.app/b2b-medusa-files/B2B-Ready-dark.png"
                    alt="B2B Ready dark"
                    className="h-48 hidden dark:block"
                />
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "login.after",
})

export default LoginWidget