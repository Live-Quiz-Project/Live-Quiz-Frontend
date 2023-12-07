declare global {
  type CreateLqsReqBody = {
    quizId: string;
    config: {
      shuffle: {
        question: boolean;
        option: boolean;
      };
      participant: {
        reanswer: boolean;
      };
      leaderboard: {
        during: boolean;
        between: boolean;
      };
      option: {
        colorless: boolean;
        show_correct_answer: boolean;
      };
    };
  };
}

export {};
