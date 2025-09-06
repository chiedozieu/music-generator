import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
  
    server: 'sandbox'
});

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
    enabled: true, 
  }, 
  // polar plugin
   plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "86347b8f-72d4-4eec-8b80-0f680e2ff5e4", // ID of Product from Polar Dashboard
                            slug: "small" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        {
                            productId: "d55c241b-9afd-474c-b487-e9128468b540",
                            slug: "medium"
                        },
                        {
                            productId: "04d3b470-07d2-4ef2-962d-1f2995eebc2b", 
                            slug: "large" 
                        }
                    ],
                    successUrl: "/",
                    authenticatedUsersOnly: true
                }),
                portal(),
                webhooks({
                    secret: env.POLAR_WEBHOOK_SECRET,
                    onOrderPaid: async (order) => {
                        const externalCustomerId = order.data.customer.externalId;
                        if (!externalCustomerId) {
                            console.error("No external customer ID found");
                            throw new Error("No external customer ID found");
                        }
                        const productId = order.data.productId

                        let creditsToAdd = 0;
                        if (productId === "86347b8f-72d4-4eec-8b80-0f680e2ff5e4") {
                            creditsToAdd = 10; // small
                        } else if (productId === "d55c241b-9afd-474c-b487-e9128468b540") {
                            creditsToAdd = 25; // medium
                        } else if (productId === "04d3b470-07d2-4ef2-962d-1f2995eebc2b") {
                            creditsToAdd = 50; // large
                        } else {
                            console.error("Unknown product ID:", productId);
                            throw new Error("Unknown product ID");
                        }
                        await db.user.update({
                            where: { id: externalCustomerId },
                            data: {
                                credits: { increment: creditsToAdd }
                            }
                        });
                    }
                })
            ],
        })
    ]
});