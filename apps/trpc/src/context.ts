import { initFirebase, log } from "@libs/environment"
import { inferAsyncReturnType, initTRPC } from "@trpc/server"
import { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import { getAuth } from "firebase-admin/auth"

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const jwt = req.headers.authorization
  if (!jwt) {
    return {
      req,
      res,
    }
  }

  try {
    await initFirebase()
    const auth = getAuth()
    const ret = await auth.verifyIdToken(jwt)
    await log("ret", ret)
    return {
      userId: ret.uid,
      req,
      res,
    }
  } catch (e) {
    await log("Error in withAuthorization", { e })
    return {
      req,
      res,
    }
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const t = initTRPC.context<Context>().create({
  allowOutsideOfServer: true,
  isServer: true,
})
