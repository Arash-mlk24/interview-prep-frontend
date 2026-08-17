import { Concept } from "../models";
import { dotnetConcepts } from "./dotnet-concepts";
import { reactConcepts } from "./react-concepts";
import { typescriptConcepts } from "./typescript-concepts";
import { systemDesignConcepts } from "./system-design-concepts";

export const allConcepts: Concept[] = [
  ...dotnetConcepts,
  ...reactConcepts,
  ...typescriptConcepts,
  ...systemDesignConcepts,
];

export {
  dotnetConcepts,
  reactConcepts,
  typescriptConcepts,
  systemDesignConcepts,
};
