import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL環境変数が設定されていません")
}

const client = postgres(process.env.DATABASE_URL)
export const db = drizzle(client, { schema })

