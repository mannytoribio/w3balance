import { t } from "./context"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export interface TokenPrice {
  id: string
  price: number
}

const fetchTokenPrices = async (
  tokenIds: string[],
  vsToken: string = "USDC"
): Promise<TokenPrice[]> => {
  try {
    const ids = tokenIds.join(",")
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${ids}&vsToken=${vsToken}`,
      {
        method: "GET",
      }
    )
    console.log("response", response)
    if (!response.ok) {
      throw new Error("Failed to fetch token prices")
    }

    const data: TokenPrice[] = await response.json()
    console.log("TokenPrice data", data)
    return data
  } catch (error) {
    console.error("Error fetching token prices", error)
    throw error
  }
}

export const tokenPriceRouter = t.router({
  getPrices: t.procedure
    .input(
      z.object({
        tokens: z.array(z.string()),
        vsToken: z.string().optional().default("USDC"),
      })
    )
    .query(async ({ input }) => {
      try {
        const { tokens, vsToken } = input
        const prices = await fetchTokenPrices(tokens, vsToken)
        return prices
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to fetch token prices",
        })
      }
    }),
})
