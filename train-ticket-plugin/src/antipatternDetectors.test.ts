import { findCycles } from "./graph/antipatternDetectors";

describe("findCycles", () => {
    it("should return an array of booleans indicating which vertices are part of a cycle", () => {
      const vertices = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ];
      const edges = [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
        { source: 2, target: 3 },
        { source: 3, target: 4 },
        { source: 4, target: 5 },
        { source: 5, target: 1 }
      ];
  
      const result = findCycles(vertices, edges);
      expect(result).toEqual([false, true, true, true, true, true]);
    });
  
    it("should handle graphs with no cycles", () => {
      const vertices = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ];
      const edges = [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 3, target: 5 },
        { source: 4, target: 5 }
      ];
  
      const result = findCycles(vertices, edges);
      expect(result).toEqual([false, false, false, false, false, false]);
    });
  
    it("should handle graphs with multiple cycles", () => {
      const vertices = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 }
      ];
      const edges = [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
        { source: 2, target: 3 },
        { source: 3, target: 0 },
        { source: 2, target: 4 },
        { source: 4, target: 5 },
        { source: 5, target: 6 },
        { source: 6, target: 4 },
        { source: 1, target: 7 },
        { source: 7, target: 1 }
      ];
  
      const result = findCycles(vertices, edges);
      expect(result).toEqual([true, true, true, true, true, true, true, true]);
    });
  
    it("should handle graphs with self-loops", () => {
      const vertices = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
        { source: 2, target: 2 }
      ];
  
      const result = findCycles(vertices, edges);
      expect(result).toEqual([false, false, true]);
    });
  });
  