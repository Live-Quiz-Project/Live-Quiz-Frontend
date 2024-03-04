import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import wsStatuses from "@/features/live/utils/statuses";
import QuestionTypesEnum from "@/common/utils/question-types";
import Choice from "@/features/live/participant/components/on-answering/choice";
import TrueFalse from "@/features/live/participant/components/on-answering/true-false";
import FillBlank from "@/features/live/participant/components/on-answering/fill-blank";
import Paragraph from "@/features/live/participant/components/on-answering/paragraph";
import Matching from "@/features/live/participant/components/on-answering/matching";
import Pool from "@/features/live/participant/components/on-answering/pool";

export default function OnAnswering() {
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(
    mod.value.question!.timeLimit
  );

  useEffect(() => {
    if (
      timeLeft === mod.value.question!.timeLimit &&
      mod.value.status === wsStatuses.ANSWERING
    ) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.1), 1))();
    }

    return () => {
      setTimeLeft(mod.value.question!.timeLimit);
    };
  }, []);

  useEffect(() => {
    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.1);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <>
      {mod.value.question!.type === QuestionTypesEnum.CHOICE && (
        <Choice timeLeft={timeLeft} />
      )}
      {mod.value.question!.type === QuestionTypesEnum.TRUE_FALSE && (
        <TrueFalse timeLeft={timeLeft} />
      )}
      {mod.value.question!.type === QuestionTypesEnum.FILL_BLANK && (
        <FillBlank timeLeft={timeLeft} />
      )}
      {mod.value.question!.type === QuestionTypesEnum.PARAGRAPH && (
        <Paragraph timeLeft={timeLeft} />
      )}
      {mod.value.question!.type === QuestionTypesEnum.MATCHING && (
        <Matching timeLeft={timeLeft} />
      )}
      {mod.value.question!.type === QuestionTypesEnum.POOL && (
        <Pool timeLeft={timeLeft} />
      )}
    </>
  );
}
