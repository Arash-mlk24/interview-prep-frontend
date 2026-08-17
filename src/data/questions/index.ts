import { Question } from "../models";
import { dotnetQuestions } from "./dotnet-questions";
import { reactQuestions } from "./react-questions";
import { typescriptQuestions } from "./typescript-questions";
import { systemDesignQuestions } from "./system-design-questions";

export const allQuestions: Question[] = [
  ...dotnetQuestions,
  ...reactQuestions,
  ...typescriptQuestions,
  ...systemDesignQuestions,
];

export {
  dotnetQuestions,
  reactQuestions,
  typescriptQuestions,
  systemDesignQuestions,
};
