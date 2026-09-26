import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';

export const experiment = sqliteTable('experiment', {
  id: text('id').primaryKey(),
});

export const experimentDay = sqliteTable(
  'experiment_day',
  {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id')
      .notNull()
      .references(() => experiment.id),
    dayNumber: integer('day_number').notNull(),
    date: text('date').notNull(),
  },
  (table) => ({
    experimentDayNumberUnique: unique(
      'experiment_day_experiment_id_day_number_unique',
    ).on(table.experimentId, table.dayNumber),

    experimentDateUnique: unique('experiment_day_experiment_id_date_unique').on(
      table.experimentId,
      table.date,
    ),

    experimentLookupIndex: index('experiment_day_experiment_id_index').on(
      table.experimentId,
    ),
  }),
);

export const healthWeightObservation = sqliteTable(
  'health_weight_observation',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    valueKg: real('value_kg').notNull(),
    observedAt: text('observed_at').notNull(),
  },
  (table) => ({
    experimentDayLookupIndex: index(
      'health_weight_observation_experiment_day_id_index',
    ).on(table.experimentDayId),

    observedAtIndex: index('health_weight_observation_observed_at_index').on(
      table.observedAt,
    ),
  }),
);

export const healthWaistObservation = sqliteTable(
  'health_waist_observation',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    valueCm: real('value_cm').notNull(),
    observedAt: text('observed_at').notNull(),
  },
  (table) => ({
    experimentDayLookupIndex: index(
      'health_waist_observation_experiment_day_id_index',
    ).on(table.experimentDayId),

    observedAtIndex: index('health_waist_observation_observed_at_index').on(
      table.observedAt,
    ),
  }),
);

export const healthRunningDistanceObservation = sqliteTable(
  'health_running_distance_observation',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    distanceKm: real('distance_km').notNull(),
    observedAt: text('observed_at').notNull(),
  },
  (table) => ({
    experimentDayLookupIndex: index(
      'health_running_distance_observation_experiment_day_id_index',
    ).on(table.experimentDayId),

    observedAtIndex: index(
      'health_running_distance_observation_observed_at_index',
    ).on(table.observedAt),
  }),
);

export const healthRunningDurationObservation = sqliteTable(
  'health_running_duration_observation',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    durationMinutes: real('duration_minutes').notNull(),
    observedAt: text('observed_at').notNull(),
  },
  (table) => ({
    experimentDayLookupIndex: index(
      'health_running_duration_observation_experiment_day_id_index',
    ).on(table.experimentDayId),

    observedAtIndex: index(
      'health_running_duration_observation_observed_at_index',
    ).on(table.observedAt),
  }),
);

export const threeSixNineSession = sqliteTable(
  'three_six_nine_session',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    period: text('period').notNull(),
    plannedRepetitions: integer('planned_repetitions').notNull(),
    completedRepetitions: integer('completed_repetitions').notNull(),
    status: text('status').notNull(),
    completedAt: text('completed_at'),
  },
  (table) => [
    unique('three_six_nine_session_day_period_unique').on(
      table.experimentDayId,
      table.period,
    ),
    check(
      'three_six_nine_session_period_check',
      sql`period IN ('morning', 'afternoon', 'evening')`,
    ),
    check(
      'three_six_nine_session_status_check',
      sql`status IN ('completed', 'not_completed', 'missing')`,
    ),
    check(
      'three_six_nine_session_planned_repetitions_check',
      sql`planned_repetitions IN (3, 6, 9)`,
    ),
    check(
      'three_six_nine_session_completed_repetitions_check',
      sql`completed_repetitions >= 0
          AND completed_repetitions <= planned_repetitions`,
    ),
  ],
);

export const protocolDefinition = sqliteTable(
  'protocol_definition',
  {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id')
      .notNull()
      .references(() => experiment.id),
    version: text('version').notNull(),
    effectiveFromDay: integer('effective_from_day').notNull(),
    effectiveToDay: integer('effective_to_day').notNull(),
  },
  (table) => ({
    experimentVersionUnique: unique(
      'protocol_definition_experiment_id_version_unique',
    ).on(table.experimentId, table.version),

    protocolEffectiveDayIndex: index(
      'protocol_definition_experiment_id_effective_day_index',
    ).on(table.experimentId, table.effectiveFromDay, table.effectiveToDay),
  }),
);

export const protocolItem = sqliteTable(
  'protocol_item',
  {
    id: text('id').primaryKey(),
    protocolDefinitionId: text('protocol_definition_id')
      .notNull()
      .references(() => protocolDefinition.id),
    itemOrder: integer('item_order').notNull(),
    description: text('description').notNull(),
    required: integer('required').notNull(),
  },
  (table) => ({
    protocolItemOrderUnique: unique(
      'protocol_item_protocol_definition_id_item_order_unique',
    ).on(table.protocolDefinitionId, table.itemOrder),

    protocolItemIdentifierUnique: unique(
      'protocol_item_protocol_definition_id_id_unique',
    ).on(table.protocolDefinitionId, table.id),
  }),
);

export const scoringDefinition = sqliteTable(
  'scoring_definition',
  {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id')
      .notNull()
      .references(() => experiment.id),
    version: text('version').notNull(),
    effectiveFromDay: integer('effective_from_day').notNull(),
    effectiveToDay: integer('effective_to_day').notNull(),
    requiredCompletedCount: integer('required_completed_count').notNull(),
    expectedCount: integer('expected_count').notNull(),
  },
  (table) => ({
    experimentVersionUnique: unique(
      'scoring_definition_experiment_id_version_unique',
    ).on(table.experimentId, table.version),

    scoringEffectiveDayIndex: index(
      'scoring_definition_experiment_id_effective_day_index',
    ).on(table.experimentId, table.effectiveFromDay, table.effectiveToDay),
  }),
);

export const experimentAmendment = sqliteTable(
  'experiment_amendment',
  {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id')
      .notNull()
      .references(() => experiment.id),
    amendedAt: text('amended_at').notNull(),
    reason: text('reason').notNull(),
  },
  (table) => ({
    experimentHistoryIndex: index(
      'experiment_amendment_experiment_id_index',
    ).on(table.experimentId),
  }),
);

export const protocolObservation = sqliteTable(
  'protocol_observation',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    protocolItemId: text('protocol_item_id')
      .notNull()
      .references(() => protocolItem.id),
    status: text('status').notNull(),
    observedAt: text('observed_at').notNull(),
  },
  (table) => ({
    dayItemUnique: unique(
      'protocol_observation_experiment_day_id_protocol_item_id_unique',
    ).on(table.experimentDayId, table.protocolItemId),

    protocolItemLookupIndex: index(
      'protocol_observation_protocol_item_id_index',
    ).on(table.protocolItemId),

    statusCheck: check(
      'protocol_observation_status_check',
      sql`${table.status} IN ('completed', 'not_completed', 'missing')`,
    ),
  }),
);

export const observationCorrection = sqliteTable(
  'observation_correction',
  {
    id: text('id').primaryKey(),
    observationId: text('observation_id')
      .notNull()
      .references(() => protocolObservation.id),
    originalStatus: text('original_status').notNull(),
    correctedStatus: text('corrected_status').notNull(),
    correctedAt: text('corrected_at').notNull(),
    reason: text('reason').notNull(),
  },
  (table) => ({
    observationHistoryIndex: index(
      'observation_correction_observation_id_index',
    ).on(table.observationId),

    correctedStatusCheck: check(
      'observation_correction_corrected_status_check',
      sql`${table.correctedStatus} IN ('completed', 'not_completed', 'missing')`,
    ),
  }),
);

export const dailyResult = sqliteTable(
  'daily_result',
  {
    id: text('id').primaryKey(),
    experimentDayId: text('experiment_day_id')
      .notNull()
      .references(() => experimentDay.id),
    scoringDefinitionVersion: text('scoring_definition_version').notNull(),
    completedCount: integer('completed_count').notNull(),
    expectedCount: integer('expected_count').notNull(),
    successful: integer('successful').notNull(),
  },
  (table) => ({
    experimentDayUnique: unique('daily_result_experiment_day_id_unique').on(
      table.experimentDayId,
    ),

    scoringDefinitionLookupIndex: index(
      'daily_result_scoring_definition_version_index',
    ).on(table.scoringDefinitionVersion),
  }),
);
