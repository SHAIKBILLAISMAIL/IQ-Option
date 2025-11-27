PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_homepage_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_key` text NOT NULL,
	`content_data` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
INSERT INTO `__new_homepage_content`("id", "section_key", "content_data", "updated_at", "updated_by") SELECT "id", "section_key", "content_data", "updated_at", "updated_by" FROM `homepage_content`;--> statement-breakpoint
DROP TABLE `homepage_content`;--> statement-breakpoint
ALTER TABLE `__new_homepage_content` RENAME TO `homepage_content`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `homepage_content_section_key_unique` ON `homepage_content` (`section_key`);