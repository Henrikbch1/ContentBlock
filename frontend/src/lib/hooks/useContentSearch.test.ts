import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { searchContent } from "../queries";
import type { SearchResponse } from "../types";
import { useContentSearch } from "./useContentSearch";

vi.mock("../queries", () => ({ searchContent: vi.fn() }));

const response = (title: string): SearchResponse => ({
  results: [{ key: title, title, href: `/${title}`, context: "Seite" }],
  hasMore: false,
  failedCollections: [],
});

const deferredResponse = () => {
  let resolve: (value: SearchResponse) => void = () => {
    throw new Error("Promise resolver not initialized.");
  };
  let reject: (reason: Error) => void = () => {
    throw new Error("Promise rejecter not initialized.");
  };
  const promise = new Promise<SearchResponse>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
};

const advanceSearch = async (): Promise<void> => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(250);
  });
};

describe("useContentSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(searchContent).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for two characters and debounces requests", async () => {
    vi.mocked(searchContent).mockResolvedValue(response("See"));
    const { result, rerender } = renderHook(
      ({ query }) => useContentSearch(query),
      { initialProps: { query: "S" } },
    );
    await advanceSearch();
    expect(searchContent).not.toHaveBeenCalled();

    rerender({ query: "Se" });
    expect(result.current.isLoading).toBe(true);
    rerender({ query: "See" });
    await advanceSearch();

    expect(searchContent).toHaveBeenCalledTimes(1);
    expect(searchContent).toHaveBeenCalledWith("See");
    expect(result.current.results[0]?.title).toBe("See");
    expect(result.current.isLoading).toBe(false);
  });

  it("ignores an older response after a newer search has finished", async () => {
    const older = deferredResponse();
    const newer = deferredResponse();
    vi.mocked(searchContent).mockImplementation((query) =>
      query === "alt" ? older.promise : newer.promise,
    );
    const { result, rerender } = renderHook(
      ({ query }) => useContentSearch(query),
      { initialProps: { query: "alt" } },
    );
    await advanceSearch();
    rerender({ query: "neu" });
    await advanceSearch();
    await act(async () => newer.resolve(response("neu")));
    await act(async () => older.resolve(response("alt")));

    expect(result.current.results.map((item) => item.title)).toEqual(["neu"]);
    expect(result.current.hasError).toBe(false);
  });

  it("does not display an outdated error for a new search", async () => {
    const newer = deferredResponse();
    vi.mocked(searchContent).mockImplementation((query) =>
      query === "alt"
        ? Promise.reject(new Error("unavailable"))
        : newer.promise,
    );
    const { result, rerender } = renderHook(
      ({ query }) => useContentSearch(query),
      { initialProps: { query: "alt" } },
    );
    await advanceSearch();
    expect(result.current.hasError).toBe(true);

    rerender({ query: "neu" });
    expect(result.current.hasError).toBe(false);
    expect(result.current.isLoading).toBe(true);
    await advanceSearch();
    expect(result.current.hasError).toBe(false);
    await act(async () => newer.resolve(response("neu")));
    expect(result.current.results[0]?.title).toBe("neu");
  });
});
