import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import Unanswered from "@/features/live/participant/components/on-answering/paragraph/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/paragraph/Answered";
import { setAnswers } from "@/features/live/store/mod-slice";
import { trigger } from "@/features/live/store/lqs-slice";
import wsActions from "@/features/live/utils/action-types";

type Props = {
  timeLeft: number;
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
  setMediaShown: Dispatch<SetStateAction<boolean>>;
  required: boolean;
};

export default function Paragraph({
  timeLeft,
  curSubQ,
  setCurSubQ,
  setMediaShown,
  required,
}: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [answer, setAnswer] = useState<string>("");

  function onSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMediaShown(false);
    dispatch(
      setAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: answer,
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
              content: answer,
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
      setAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: null,
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
              content: null,
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
        (mod.value.answers?.answers[curSubQ].content === undefined ||
          mod.value.answers?.answers[curSubQ].content === null)) ? (
        <Unanswered
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={onSubmit}
          q={mod.value.question!.subquestions[curSubQ]}
          required={required}
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
