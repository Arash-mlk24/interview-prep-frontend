import { Question } from "../models";
import { dotnetQuestions } from "./dotnet-questions";
import { reactQuestions } from "./react-questions";
import { typescriptQuestions } from "./typescript-questions";

export const allQuestions: Question[] = [
  ...dotnetQuestions,
  ...reactQuestions,
  ...typescriptQuestions,
];

export { dotnetQuestions, reactQuestions, typescriptQuestions };
