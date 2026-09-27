CREATE TABLE `wealth_revenue_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`amount` real NOT NULL,
	`observed_at` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wealth_revenue_observation_experiment_day_id_index` ON `wealth_revenue_observation` (`experiment_day_id`);--> statement-breakpoint
CREATE INDEX `wealth_revenue_observation_observed_at_index` ON `wealth_revenue_observation` (`observed_at`);