CREATE TABLE `evidence_observation` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`hypothesis_id` text NOT NULL,
	`category` text NOT NULL,
	`observation` text NOT NULL,
	`recorded_at` text NOT NULL,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "evidence_observation_category_check" CHECK("evidence_observation"."category" IN ('supporting', 'challenging', 'alternative_explanation'))
);
--> statement-breakpoint
CREATE INDEX `evidence_observation_experiment_day_id_index` ON `evidence_observation` (`experiment_day_id`);--> statement-breakpoint
CREATE INDEX `evidence_observation_hypothesis_id_index` ON `evidence_observation` (`hypothesis_id`);