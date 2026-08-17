import { Roadmap } from "../models";
import { dotnetRoadmaps } from "./dotnet";
import { reactRoadmaps } from "./react";
import { typescriptRoadmaps } from "./typescript";
import { systemDesignRoadmaps } from "./system-design";

export const allRoadmaps: Roadmap[] = [
  ...dotnetRoadmaps,
  ...reactRoadmaps,
  ...typescriptRoadmaps,
  ...systemDesignRoadmaps,
];
