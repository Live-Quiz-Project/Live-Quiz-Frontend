import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { setAnswers } from "@/features/live/store/mod-slice";
import { useDispatch } from "react-redux";
import { trigger } from "@/features/live/store/lqs-slice";
import Unanswered from "@/features/live/participant/components/on-answering/true-false/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/true-false/Answered";
import wsActions from "@/features/live/utils/action-types";

type Props = {
  timeLeft: number;
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
  setMediaShown: Dispatch<SetStateAction<boolean>>;
  required: boolean;
};

export default function TrueFalse({
  timeLeft,
  curSubQ,
  setCurSubQ,
  setMediaShown,
  required,
}: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);

  function onSubmit(e: FormEvent<HTMLInputElement>, opt: ChoiceOption) {
    e.preventDefault();
    setMediaShown(false);
    dispatch(
      setAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: [opt],
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
              content: [opt],
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
        />
      ) : (
        <Answered
          q={mod.value.question!.subquestions[curSubQ]}
          a={mod.value.answers.answers[curSubQ].content[0]}
          onUnsubmit={onUnsubmit}
        />
      )}
    </>
  );
}
