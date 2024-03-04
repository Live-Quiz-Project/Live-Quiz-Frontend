declare global {
  type Question = {
    id: string;
    pool: number;
    poolRequired: boolean;
    type: string;
    content: string;
    note: string;
    mediaType: string;
    media: string;
    timeLimit: number;
    haveTimeFactor: boolean;
    timeFactor: number;
    fontSize: number;
    layout: number;
    selectMin: number;
    selectMax: number;
    subquestions: Question[];
    options: ChoiceOption[] | TextOption[] | MatchingOption;
  };

  type ChoiceOption = {
    id: string;
    content: string;
    color: string;
    mark: number;
    correct: boolean;
  };

  type TextOption = {
    id: string;
    answer: string;
    content: string;
    correct: boolean;
    mark: number;
    caseSensitive: boolean;
  };

  type MatchingOption = {
    prompts: MatchingOptionPrompt[];
    options: MatchingOptionOption[];
  };
  type MatchingOptionPrompt = {
    id: string;
    content: string;
    color: "white";
    order: number;
  };
  type MatchingOptionOption = {
    id: string;
    content: string;
    color: string;
    order: number;
    eliminate: boolean;
  };
  type MatchingAnswer = {
    prompt: string;
    option: string;
    correct: boolean;
    mark: number;
  };

  type AnswerResponse = {
    pid: string;
    qid: string;
    type: string;
    time: number;
    options: ChoiceOption[] | TextOption[] | string | MatchingAnswer[];
  };
}

export {};
