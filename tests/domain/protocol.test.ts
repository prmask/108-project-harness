import { describe, expect, it } from "vitest";
import {
  getInitialProtocol,
  getProtocolForDay,
} from "../../src/domain/protocol.js";

describe("Protocol", () => {
  it("contains exactly 13 protocol items", () => {
    expect(getInitialProtocol().items).toHaveLength(13);
  });

  it("preserves the defined protocol ordering", () => {
    const items = getInitialProtocol().items;

    expect(items.map((item) => item.order)).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 1),
    );
  });

  it("gives each protocol item a stable identifier", () => {
    const ids = getInitialProtocol().items.map((item) => item.id);

    expect(new Set(ids).size).toBe(13);
    expect(ids.every(Boolean)).toBe(true);
  });

  it("identifies the protocol version", () => {
    expect(getInitialProtocol().version).toBe("v1");
  });

  it("resolves the protocol for an experiment day", () => {
    expect(getProtocolForDay(1)).toEqual(getInitialProtocol());
    expect(getProtocolForDay(108)).toEqual(getInitialProtocol());
  });

  it("contains the authoritative first and last protocol conditions", () => {
    const items = getInitialProtocol().items;

    expect(items[0].description).toBe("03:50 Wake");
    expect(items[12].description).toBe("22:00 Sleep");
  });
});
