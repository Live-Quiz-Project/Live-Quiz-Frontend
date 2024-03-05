import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { setAnswers as setStoreAnswers } from "@/features/live/store/mod-slice";
import { trigger } from "@/features/live/store/lqs-slice";
import wsActions from "@/features/live/utils/action-types";
import Unanswered from "@/features/live/participant/components/on-answering/matching/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/matching/Answered";

type Props = {
  timeLeft: number;
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
  setMediaShown: Dispatch<SetStateAction<boolean>>;
  required: boolean;
};

export default function Matching({
  timeLeft,
  curSubQ,
  setCurSubQ,
  setMediaShown,
  required,
}: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [notAllAnswered, setNotAllAnswered] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{
    [x: string]: string;
  }>(
    (
      mod.value.question!.subquestions[curSubQ].options as MatchingOption
    ).prompts.reduce((acc, p) => ({ ...acc, [p.id]: "" }), {})
  );

  function onSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (Object.values(answers).some((o) => o === "")) {
      setNotAllAnswered(true);
      return;
    }
    setMediaShown(false);
    setNotAllAnswered(false);
    dispatch(
      setStoreAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: Object.entries(answers).map(([promptId, optionId]) => ({
              prompt: promptId,
              option: optionId,
            })),
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
              content: Object.entries(answers).map(([promptId, optionId]) => ({
                prompt: promptId,
                option: optionId,
              })),
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
          selectedOptions={answers}
          setSelectedOptions={setAnswers}
          notAllAnswered={notAllAnswered}
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
