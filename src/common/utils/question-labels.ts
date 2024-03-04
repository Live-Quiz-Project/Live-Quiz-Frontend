import QuestionTypesEnum from "./question-types";

const QuestionLabels = {
  [QuestionTypesEnum.CHOICE]: "Multiple Choice",
  [QuestionTypesEnum.TRUE_FALSE]: "True/False",
  [QuestionTypesEnum.FILL_BLANK]: "Fill in the Blank",
  [QuestionTypesEnum.PARAGRAPH]: "Paragraph",
  [QuestionTypesEnum.MATCHING]: "Matching",
  [QuestionTypesEnum.POOL]: "Pool",
};

export default QuestionLabels;
