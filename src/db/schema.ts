import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';



// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  role: text("role").notNull().default("user"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Add homepage_content table
export const homepageContent = sqliteTable("homepage_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionKey: text("section_key").notNull().unique(),
  contentData: text("content_data").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  updatedBy: text("updated_by"),
});

// Add admin_sessions table
export const adminSessions = sqliteTable('admin_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  adminUsername: text('admin_username').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

// Add user_balances table
export const userBalances = sqliteTable('user_balances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  balance: real('balance').notNull().default(10000.00),
  realBalance: real('real_balance').notNull().default(0.00),
  currency: text('currency').notNull().default('USD'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Add deposits table
export const deposits = sqliteTable('deposits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  paymentMethod: text('payment_method').notNull(),
  status: text('status').notNull().default('pending'),
  transactionId: text('transaction_id').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Add withdrawals table
export const withdrawals = sqliteTable('withdrawals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  method: text('method').notNull(),
  status: text('status').notNull().default('pending'),
  payoutDetails: text('payout_details'),
  referenceId: text('reference_id'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Add trades table (open positions)
export const trades = sqliteTable('trades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  assetName: text('asset_name').notNull(),
  assetType: text('asset_type').notNull(),
  direction: text('direction').notNull(),
  amount: real('amount').notNull(),
  entryPrice: real('entry_price').notNull(),
  currentPrice: real('current_price').notNull(),
  quantity: real('quantity').notNull(),
  leverage: integer('leverage').notNull().default(1),
  stopLoss: real('stop_loss'),
  takeProfit: real('take_profit'),
  pnl: real('pnl').notNull().default(0.00),
  status: text('status').notNull().default('open'),
  accountType: text('account_type').notNull().default('practice'),
  duration: integer('duration'), // Duration in minutes
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // Expiration time
  openedAt: integer('opened_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Add trading_history table (closed positions)
export const tradingHistory = sqliteTable('trading_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tradeId: integer('trade_id'),
  assetName: text('asset_name').notNull(),
  assetType: text('asset_type').notNull(),
  direction: text('direction').notNull(),
  amount: real('amount').notNull(),
  entryPrice: real('entry_price').notNull(),
  exitPrice: real('exit_price').notNull(),
  quantity: real('quantity').notNull(),
  leverage: integer('leverage').notNull(),
  pnl: real('pnl').notNull(),
  accountType: text('account_type').notNull(),
  openedAt: integer('opened_at', { mode: 'timestamp' }).notNull(),
  closedAt: integer('closed_at', { mode: 'timestamp' }).notNull(),
});