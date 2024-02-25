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
    options: ChoiceOption[] | TextOption[] | MatchingOption[];
  };

  type ChoiceOption = {
    id: string;
    order: number;
    content: string;
    color: string;
    mark: number;
  };

  type TextOption = {
    id: string;
    order: number;
    content: string;
    caseSensitive: boolean;
  };

  type MatchingOption = MatchingOptionPrompt | MatchingOptionOption;
  type MatchingOptionPrompt = {
    id: string;
    type: "MATCHING_PROMPT";
    content: string;
    color: "white";
    order: number;
    eliminate: false;
  };
  type MatchingOptionOption = {
    id: string;
    type: "MATCHING_OPTION";
    content: string;
    color: string;
    order: number;
    eliminate: boolean;
  };

  type AnswerResponse = {
    pid: string;
    qid: string;
    type: string;
    time: number;
    options: ChoiceOption[] | TextOption[] | MatchingOption[];
  };
}

export {};
