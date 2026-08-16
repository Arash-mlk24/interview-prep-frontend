import { Level } from "../data/models";
import { levels } from "../data/levels";

export const levelRepository = {
  getAllLevels(): Level[] {
    return [...levels];
  },

  getSortedLevels(): Level[] {
    return [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
  },

  getLevelById(id: string): Level | undefined {
    return levels.find((l) => l.id === id);
  },
};
