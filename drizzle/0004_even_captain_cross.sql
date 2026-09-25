CREATE TABLE `three_six_nine_session` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment_day_id` text NOT NULL,
	`period` text NOT NULL,
	`planned_repetitions` integer NOT NULL,
	`completed_repetitions` integer NOT NULL,
	`status` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`experiment_day_id`) REFERENCES `experiment_day`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "three_six_nine_session_period_check" CHECK(period IN ('morning', 'afternoon', 'evening')),
	CONSTRAINT "three_six_nine_session_status_check" CHECK(status IN ('completed', 'not_completed', 'missing')),
	CONSTRAINT "three_six_nine_session_planned_repetitions_check" CHECK(planned_repetitions IN (3, 6, 9)),
	CONSTRAINT "three_six_nine_session_completed_repetitions_check" CHECK(completed_repetitions >= 0
          AND completed_repetitions <= planned_repetitions)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `three_six_nine_session_day_period_unique` ON `three_six_nine_session` (`experiment_day_id`,`period`);