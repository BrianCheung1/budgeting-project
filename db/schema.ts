import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"


export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})

//Relation of account to transactions
//One account can have many transactions
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}))

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})

//Relation of account to categories
//One category can have many transactions
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}))

export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
})

//Relation of transactions to account/category
//Each transaction only has one account and one category
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
})
