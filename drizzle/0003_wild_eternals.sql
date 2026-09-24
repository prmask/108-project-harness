PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_observation_correction` (
	`id` text PRIMARY KEY NOT NULL,
	`observation_id` text NOT NULL,
	`original_status` text NOT NULL,
	`corrected_status` text NOT NULL,
	`corrected_at` text NOT NULL,
	`reason` text NOT NULL,
	FOREIGN KEY (`observation_id`) REFERENCES `protocol_observation`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "observation_correction_corrected_status_check" CHECK("__new_observation_correction"."corrected_status" IN ('completed', 'not_completed', 'missing'))
);
--> statement-breakpoint
INSERT INTO `__new_observation_correction`("id", "observation_id", "original_status", "corrected_status", "corrected_at", "reason") SELECT "id", "observation_id", "original_status", "corrected_status", "corrected_at", "reason" FROM `observation_correction`;--> statement-breakpoint
DROP TABLE `observation_correction`;--> statement-breakpoint
ALTER TABLE `__new_observation_correction` RENAME TO `observation_correction`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `observation_correction_observation_id_index` ON `observation_correction` (`observation_id`);