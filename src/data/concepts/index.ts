import { Concept } from "../models";
import { dotnetConcepts } from "./dotnet-concepts";
import { reactConcepts } from "./react-concepts";
import { typescriptConcepts } from "./typescript-concepts";

export const allConcepts: Concept[] = [
  ...dotnetConcepts,
  ...reactConcepts,
  ...typescriptConcepts,
];

export { dotnetConcepts, reactConcepts, typescriptConcepts };
