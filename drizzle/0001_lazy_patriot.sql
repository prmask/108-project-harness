CREATE TABLE `daily_result` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`scoring_definition_version` text NOT NULL,
	`completed_count` integer NOT NULL,
	`expected_count` integer NOT NULL,
	`successful` integer NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_result_experiment_day_id_unique` ON `daily_result` (`experiment_day_id`);--> statement-breakpoint
CREATE TABLE `experiment_amendment` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_id` text NOT NULL,
	`amended_at` text NOT NULL,
	`reason` text NOT NULL,
	FOREIGN KEY (`experiment_id`) REFERENCES `experiment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `observation_correction` (
	`id` text PRIMARY KEY NOT NULL,
	`observation_id` text NOT NULL,
	`original_status` text NOT NULL,
	`corrected_status` text NOT NULL,
	`corrected_at` text NOT NULL,
	`reason` text NOT NULL,
	FOREIGN KEY (`observation_id`) REFERENCES `protocol_observation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `protocol_definition` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_id` text NOT NULL,
	`version` text NOT NULL,
	`effective_from_day` integer NOT NULL,
	`effective_to_day` integer NOT NULL,
	FOREIGN KEY (`experiment_id`) REFERENCES `experiment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `protocol_definition_experiment_id_version_unique` ON `protocol_definition` (`experiment_id`,`version`);--> statement-breakpoint
CREATE TABLE `protocol_item` (
	`id` text PRIMARY KEY NOT NULL,
	`protocol_definition_id` text NOT NULL,
	`item_order` integer NOT NULL,
	`description` text NOT NULL,
	`required` integer NOT NULL,
	FOREIGN KEY (`protocol_definition_id`) REFERENCES `protocol_definition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `protocol_item_protocol_definition_id_item_order_unique` ON `protocol_item` (`protocol_definition_id`,`item_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `protocol_item_protocol_definition_id_id_unique` ON `protocol_item` (`protocol_definition_id`,`id`);--> statement-breakpoint
CREATE TABLE `protocol_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`protocol_item_id` text NOT NULL,
	`status` text NOT NULL,
	`observed_at` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`protocol_item_id`) REFERENCES `protocol_item`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "protocol_observation_status_check" CHECK("protocol_observation"."status" IN ('completed', 'not_completed', 'missing'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `protocol_observation_experiment_day_id_protocol_item_id_unique` ON `protocol_observation` (`experiment_day_id`,`protocol_item_id`);--> statement-breakpoint
CREATE TABLE `scoring_definition` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_id` text NOT NULL,
	`version` text NOT NULL,
	`effective_from_day` integer NOT NULL,
	`effective_to_day` integer NOT NULL,
	`required_completed_count` integer NOT NULL,
	`expected_count` integer NOT NULL,
	FOREIGN KEY (`experiment_id`) REFERENCES `experiment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scoring_definition_experiment_id_version_unique` ON `scoring_definition` (`experiment_id`,`version`);