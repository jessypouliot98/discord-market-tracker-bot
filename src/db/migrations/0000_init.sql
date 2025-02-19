CREATE TABLE `listing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tracker_id` integer NOT NULL,
	`listing_id` text NOT NULL,
	`title` text NOT NULL,
	`price` text NOT NULL,
	`location` text,
	`url` text NOT NULL,
	`thumbnail_url` text,
	FOREIGN KEY (`tracker_id`) REFERENCES `tracker`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tracker_listing` ON `listing` (`tracker_id`,`listing_id`);--> statement-breakpoint
CREATE TABLE `tracker` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`channel_id` text NOT NULL,
	`owner_id` text NOT NULL
);
