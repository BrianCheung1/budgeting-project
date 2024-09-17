import { Hono } from "hono"
import { db } from "@/db/drizzle"
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"
import { z } from "zod"
import { parse, subDays } from "date-fns"

const app = new Hono()
  //get all transactions for logged in user
  //default date range is 30 days
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      const { from, to, accountId } = c.req.valid("query")

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const defaultTo = new Date()
      const defaultFrom = subDays(defaultTo, 30)

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        //Required as we need an account name for every transaction
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        //Not required but will still load the transactions
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date))
      return c.json({ data })
    }
  )
  //get a singular transaction for logged in user
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),

    async (c) => {
      const auth = getAuth(c)
      const { id } = c.req.valid("param")

      if (!id) {
        return c.json({ error: "Missing Id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))

      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }
      return c.json({ data })
    }
  )
  //create a transaction for logged in user
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      const values = c.req.valid("json")

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }
      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning()

      return c.json({ data })
    }
  )
  //delete multiple transaction for logged in user
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c)
      const values = c.req.valid("json")
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        //Load transactions with account ids
        //Load transactions that have been passed in ids
        //Load transactions that have matching userId with logged in user
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      )
      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({ id: transactions.id })
      return c.json({ data })
    }
  )
  //create multiple transaction for logged in user
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c)
      const values = c.req.valid("json")

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning()

      return c.json({ data })
    }
  )
  //edit a transaction for logged in user
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      const { id } = c.req.valid("param")
      const values = c.req.valid("json")

      if (!id) {
        return c.json({ error: "Missing Id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        //Load transactions with account ids
        //Load a transaction that matches provided id
        //Load a transaction's account id that mataches with logged in id
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      )

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning()

      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }
      return c.json({ data })
    }
  )
  //delete a transaction for logged in user
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      const { id } = c.req.valid("param")

      if (!id) {
        return c.json({ error: "Missing Id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const transactionToDelete = db.$with("transaction_to_delete").as(
        //Load transactions with account ids
        //Load a transaction that matches provided id
        //Load a transaction's account id that mataches with logged in id
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      )

      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        )
        .returning({
          id: transactions.id,
        })

      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }
      return c.json({ data })
    }
  )

export default app
