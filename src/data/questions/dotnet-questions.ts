import { Question } from "../models";
import { dotnetJuniorQuestions } from "./dotnet/junior-questions";
import { dotnetMidQuestions } from "./dotnet/mid-questions";
import { dotnetSeniorQuestions } from "./dotnet/senior-questions";

export const dotnetQuestions: Question[] = [
  ...dotnetJuniorQuestions,
  ...dotnetMidQuestions,
  ...dotnetSeniorQuestions,
];
