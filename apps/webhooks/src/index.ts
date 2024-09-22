import { SecretManagerServiceClient } from "@google-cloud/secret-manager"

const PROJECT_ID = process.env.PROJECT_ID!

const getHeliusAuthSecret = async () => {
  const client = new SecretManagerServiceClient()
  const [response] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/helius-auth/versions/latest`,
  })
  const secretString = response.payload?.data?.toString()
  return secretString
}
