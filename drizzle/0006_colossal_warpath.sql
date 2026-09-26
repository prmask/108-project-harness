CREATE TABLE `health_waist_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`value_cm` real NOT NULL,
	`observed_at` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `health_waist_observation_experiment_day_id_index` ON `health_waist_observation` (`experiment_day_id`);--> statement-breakpoint
CREATE INDEX `health_waist_observation_observed_at_index` ON `health_waist_observation` (`observed_at`);