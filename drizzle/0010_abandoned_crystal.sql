CREATE TABLE `opportunity_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`what_happened` text NOT NULL,
	`source` text NOT NULL,
	`is_unexpected` integer NOT NULL,
	`goal_related` integer NOT NULL,
	`action_taken` text NOT NULL,
	`potential_value` real,
	`actual_value` real,
	`outcome` text NOT NULL,
	`notes` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `opportunity_observation_experiment_day_id_index` ON `opportunity_observation` (`experiment_day_id`);