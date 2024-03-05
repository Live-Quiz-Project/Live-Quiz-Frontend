import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { trigger } from "@/features/live/store/lqs-slice";
import { setAnswers as setStoreAnswers } from "@/features/live/store/mod-slice";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import wsActions from "@/features/live/utils/action-types";
import Unanswered from "@/features/live/participant/components/on-answering/choice/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/choice/Answered";

type Props = {
  timeLeft: number;
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
  setMediaShown: Dispatch<SetStateAction<boolean>>;
  required: boolean;
};

export default function Choice({
  timeLeft,
  curSubQ,
  setCurSubQ,
  setMediaShown,
  required,
}: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [answers, setAnswers] = useState<ChoiceOption[]>([]);
  const [invalidAmountOfOptions, setInvalidAmountOfOptions] =
    useState<boolean>(false);

  function onSubmit(
    e?: FormEvent<HTMLInputElement | HTMLButtonElement>,
    opt?: ChoiceOption[]
  ) {
    if (e) e.preventDefault();
    const selOpt = opt ? opt : answers;
    if (
      selOpt.length < mod.value.question!.selectMin ||
      selOpt.length > mod.value.question!.selectMax
    ) {
      setInvalidAmountOfOptions(true);
      return;
    }
    setMediaShown(false);
    setInvalidAmountOfOptions(false);
    dispatch(
      setStoreAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: [...selOpt],
          },
        },
        time: Math.round((mod.value.question!.timeLimit - timeLeft) * 10),
        marks: null,
      })
    );
    dispatch(
      trigger({
        type: wsActions.SUBMIT_ANSWER,
        payload: {
          pid: auth.value.participant.id,
          qid: mod.value.question!.id,
          type: mod.value.question!.type,
          time: Math.round((mod.value.question!.timeLimit - timeLeft) * 10),
          options: {
            ...mod.value.answers?.answers,
            [curSubQ]: {
              type: mod.value.question!.subquestions[curSubQ].type,
              qid: mod.value.question!.subquestions[curSubQ].id,
              content: [...selOpt],
            },
          },
        } as AnswerResponse,
      })
    );
    setCurSubQ((prev) =>
      prev < mod.value.question!.subquestions.length - 1 ? prev + 1 : prev
    );
  }

  function onUnsubmit() {
    dispatch(
      setStoreAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: [],
          },
        },
        time: null,
        marks: null,
      })
    );
    dispatch(
      trigger({
        type: wsActions.SUBMIT_ANSWER,
        payload: {
          pid: auth.value.participant.id,
          qid: mod.value.question!.id,
          type: mod.value.question!.type,
          time: Math.round((mod.value.question!.timeLimit - timeLeft) * 10),
          options: {
            ...mod.value.answers?.answers,
            [curSubQ]: {
              type: mod.value.question!.subquestions[curSubQ].type,
              qid: mod.value.question!.subquestions[curSubQ].id,
              content: [],
            },
          },
        } as AnswerResponse,
      })
    );
  }

  return (
    <>
      {!mod.value.answers ||
      (mod.value.answers && !mod.value.answers?.answers[curSubQ]) ||
      (mod.value.answers &&
        mod.value.answers?.answers.hasOwnProperty(curSubQ) &&
        mod.value.answers?.answers[curSubQ].content.length <= 0) ? (
        <Unanswered
          onSubmit={onSubmit}
          q={mod.value.question!.subquestions[curSubQ]}
          required={required}
          invalidAmountOfOptions={invalidAmountOfOptions}
          selectedOptions={answers}
          setSelectedOptions={setAnswers}
        />
      ) : (
        <Answered
          q={mod.value.question!.subquestions[curSubQ]}
          a={mod.value.answers.answers[curSubQ].content}
          onUnsubmit={onUnsubmit}
        />
      )}
    </>
  );
}
