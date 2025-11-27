CREATE TABLE `deposits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`transaction_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deposits_transaction_id_unique` ON `deposits` (`transaction_id`);--> statement-breakpoint
CREATE TABLE `trades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`asset_name` text NOT NULL,
	`asset_type` text NOT NULL,
	`direction` text NOT NULL,
	`amount` real NOT NULL,
	`entry_price` real NOT NULL,
	`current_price` real NOT NULL,
	`quantity` real NOT NULL,
	`leverage` integer DEFAULT 1 NOT NULL,
	`stop_loss` real,
	`take_profit` real,
	`pnl` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`account_type` text DEFAULT 'practice' NOT NULL,
	`opened_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trading_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`trade_id` integer,
	`asset_name` text NOT NULL,
	`asset_type` text NOT NULL,
	`direction` text NOT NULL,
	`amount` real NOT NULL,
	`entry_price` real NOT NULL,
	`exit_price` real NOT NULL,
	`quantity` real NOT NULL,
	`leverage` integer NOT NULL,
	`pnl` real NOT NULL,
	`account_type` text NOT NULL,
	`opened_at` integer NOT NULL,
	`closed_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_balances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`balance` real DEFAULT 10000 NOT NULL,
	`real_balance` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
