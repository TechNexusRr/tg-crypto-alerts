CREATE TABLE `alert_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alert_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`alert_id`) REFERENCES `alerts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `alert_events_alert_id_idx` ON `alert_events` (`alert_id`);--> statement-breakpoint
CREATE INDEX `alert_events_user_created_idx` ON `alert_events` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `alerts_user_active_idx` ON `alerts` (`user_id`,`is_active`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` text NOT NULL,
	`username` text,
	`created_at` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_chat_id_idx` ON `users` (`chat_id`);