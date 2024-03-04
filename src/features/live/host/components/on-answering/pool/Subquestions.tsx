import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, SetStateAction } from "react";
import Choice from "@/features/live/host/components/on-answering/Choice";
import TrueFalse from "@/features/live/host/components/on-answering/TrueFalse";
import FillBlank from "@/features/live/host/components/on-answering/FillBlank";
import Paragraph from "@/features/live/host/components/on-answering/Paragraph";
import Matching from "@/features/live/host/components/on-answering/Matching";
import QuestionTypesEnum from "@/common/utils/question-types";

type Props = {
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
};

export default function Subquestions({ curSubQ, setCurSubQ }: Props) {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <>
      {mod.value.question!.subquestions[curSubQ].type ===
        QuestionTypesEnum.CHOICE && (
        <Choice
          q={mod.value.question!.subquestions[curSubQ]}
          setCurSubQ={setCurSubQ}
        />
      )}
      {mod.value.question!.subquestions[curSubQ].type ===
        QuestionTypesEnum.TRUE_FALSE && (
        <TrueFalse
          q={mod.value.question!.subquestions[curSubQ]}
          setCurSubQ={setCurSubQ}
        />
      )}
      {mod.value.question!.subquestions[curSubQ].type ===
        QuestionTypesEnum.FILL_BLANK && (
        <FillBlank
          q={mod.value.question!.subquestions[curSubQ]}
          setCurSubQ={setCurSubQ}
        />
      )}
      {mod.value.question!.subquestions[curSubQ].type ===
        QuestionTypesEnum.PARAGRAPH && (
        <Paragraph
          q={mod.value.question!.subquestions[curSubQ]}
          setCurSubQ={setCurSubQ}
        />
      )}
      {mod.value.question!.subquestions[curSubQ].type ===
        QuestionTypesEnum.MATCHING && (
        <Matching
          q={mod.value.question!.subquestions[curSubQ]}
          setCurSubQ={setCurSubQ}
        />
      )}
    </>
  );
}
