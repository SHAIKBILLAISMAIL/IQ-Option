CREATE TABLE `homepage_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_key` text NOT NULL,
	`content_data` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `homepage_content_section_key_unique` ON `homepage_content` (`section_key`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;