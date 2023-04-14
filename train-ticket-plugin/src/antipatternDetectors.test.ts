import { findCycles } from "graph/antipatternDetectors";


describe("findCycles", () => {
  it("should find all cycles in a graph", () => {
    const vertices = [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
    ];
    const edges = [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "E", target: "B" },
      { source: "C", target: "A" },
    ];
    const result = findCycles(vertices, edges);
    expect(result).toEqual(new Set([0, 1, 2, 3, 4]));
  });

  it("should handle disconnected graphs", () => {
    const vertices = [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
    ];
    const edges = [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
    ];
    const result = findCycles(vertices, edges);
    expect(result).toEqual(new Set());
  });

  it("should handle graphs with no cycles", () => {
    const vertices = [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
    ];
    const edges = [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "E", target: "A" },
    ];
    const result = findCycles(vertices, edges);
    expect(result).toEqual(new Set());
  });

  it("should find two separate cycles", () => {
    const vertices = [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
      { id: "F" },
      { id: "G" },
    ];
    const edges = [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "E", target: "B" },
      { source: "C", target: "F" },
      { source: "F", target: "G" },
      { source: "G", target: "C" },
    ];
    const result = findCycles(vertices, edges);
    expect(result).toEqual(new Set([1, 2, 3, 4, 6, 7]));
  });
});
