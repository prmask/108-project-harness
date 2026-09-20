export type ProtocolItem = {
  id: string;
  order: number;
  description: string;
  required: boolean;
};

export type ProtocolDefinition = {
  version: string;
  effectiveFromDay: number;
  effectiveToDay: number;
  items: readonly ProtocolItem[];
};

const INITIAL_PROTOCOL: ProtocolDefinition = {
  version: "v1",
  effectiveFromDay: 1,
  effectiveToDay: 108,
  items: [
    {
      id: "wake-0350",
      order: 1,
      description: "03:50 Wake",
      required: true,
    },
    {
      id: "lamp-prayer-0405",
      order: 2,
      description: "04:05 Light lamp + prayer",
      required: true,
    },
    {
      id: "hanuman-chalisa-0410",
      order: 3,
      description: "04:10 Hanuman Chalisa",
      required: true,
    },
    {
      id: "meditation-0420",
      order: 4,
      description: "04:20 Meditation",
      required: true,
    },
    {
      id: "surya-namaskar-0450",
      order: 5,
      description: "04:50 Surya Namaskar",
      required: true,
    },
    {
      id: "run-0520",
      order: 6,
      description: "05:20 Run",
      required: true,
    },
    {
      id: "wake-lakshmi-0600",
      order: 7,
      description: "06:00 Wake Lakshmi",
      required: true,
    },
    {
      id: "kettlebell-0800",
      order: 8,
      description: "08:00 Kettlebell routine",
      required: true,
    },
    {
      id: "work-0900",
      order: 9,
      description: "09:00 Start work",
      required: true,
    },
    {
      id: "breakfast-1000",
      order: 10,
      description: "10:00 Breakfast (3 boiled eggs and vegetables)",
      required: true,
    },
    {
      id: "lunch-1330",
      order: 11,
      description: "13:30 Lunch",
      required: true,
    },
    {
      id: "fast-1800",
      order: 12,
      description: "18:00 Begin 16-hour fast",
      required: true,
    },
    {
      id: "sleep-2200",
      order: 13,
      description: "22:00 Sleep",
      required: true,
    },
  ],
};

export function getInitialProtocol(): ProtocolDefinition {
  return INITIAL_PROTOCOL;
}

export function getProtocolForDay(
  dayNumber: number,
): ProtocolDefinition {
  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > 108
  ) {
    throw new Error(`Invalid experiment day: ${dayNumber}`);
  }

  return INITIAL_PROTOCOL;
}
