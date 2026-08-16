import { Concept } from "../data/models";
import { allConcepts } from "../data/concepts";

export const conceptRepository = {
  getAllConcepts(): Concept[] {
    return [...allConcepts];
  },

  getConceptsByStackId(stackId: string): Concept[] {
    return allConcepts.filter((c) => c.stackId === stackId);
  },

  getConceptById(id: string): Concept | undefined {
    return allConcepts.find((c) => c.id === id);
  },
};
