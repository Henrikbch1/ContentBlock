import { describe, expect, it } from "vitest";

import { buildVisibleEventsFilter } from "./eventQueries";

describe("buildVisibleEventsFilter", () => {
  const now = "2026-10-11T10:00:00.000Z";

  it("requires visible_from to be empty or reached", () => {
    const [visibility] = buildVisibleEventsFilter(now)._and;

    expect(visibility).toEqual({
      _or: [{ visible_from: { _null: true } }, { visible_from: { _lte: now } }],
    });
  });

  it("keeps events until end_date, or start_date when there is no end", () => {
    const [, notOver] = buildVisibleEventsFilter(now)._and;

    expect(notOver).toEqual({
      _or: [
        { end_date: { _gte: now } },
        {
          _and: [{ end_date: { _null: true } }, { start_date: { _gte: now } }],
        },
      ],
    });
  });
});
