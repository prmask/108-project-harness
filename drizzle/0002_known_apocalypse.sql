CREATE INDEX `daily_result_scoring_definition_version_index` ON `daily_result` (`scoring_definition_version`);--> statement-breakpoint
CREATE INDEX `experiment_amendment_experiment_id_index` ON `experiment_amendment` (`experiment_id`);--> statement-breakpoint
CREATE INDEX `experiment_day_experiment_id_index` ON `experiment_day` (`experiment_id`);--> statement-breakpoint
CREATE INDEX `observation_correction_observation_id_index` ON `observation_correction` (`observation_id`);--> statement-breakpoint
CREATE INDEX `protocol_definition_experiment_id_effective_day_index` ON `protocol_definition` (`experiment_id`,`effective_from_day`,`effective_to_day`);--> statement-breakpoint
CREATE INDEX `protocol_observation_protocol_item_id_index` ON `protocol_observation` (`protocol_item_id`);--> statement-breakpoint
CREATE INDEX `scoring_definition_experiment_id_effective_day_index` ON `scoring_definition` (`experiment_id`,`effective_from_day`,`effective_to_day`);