CREATE TABLE `experiment` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experiment_day` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_id` text NOT NULL,
	`day_number` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`experiment_id`) REFERENCES `experiment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `experiment_day_experiment_id_day_number_unique` ON `experiment_day` (`experiment_id`,`day_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `experiment_day_experiment_id_date_unique` ON `experiment_day` (`experiment_id`,`date`);