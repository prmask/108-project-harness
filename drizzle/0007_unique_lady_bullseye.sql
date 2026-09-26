CREATE TABLE `health_running_distance_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`distance_km` real NOT NULL,
	`observed_at` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `health_running_distance_observation_experiment_day_id_index` ON `health_running_distance_observation` (`experiment_day_id`);--> statement-breakpoint
CREATE INDEX `health_running_distance_observation_observed_at_index` ON `health_running_distance_observation` (`observed_at`);