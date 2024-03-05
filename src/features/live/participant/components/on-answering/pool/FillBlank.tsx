import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { trigger } from "@/features/live/store/lqs-slice";
import { setAnswers as setStoreAnswers } from "@/features/live/store/mod-slice";
import wsActions from "@/features/live/utils/action-types";
import Unanswered from "@/features/live/participant/components/on-answering/fill-blank/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/fill-blank/Answered";

type Props = {
  timeLeft: number;
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
  setMediaShown: Dispatch<SetStateAction<boolean>>;
  required: boolean;
};

export default function FillBlank({
  timeLeft,
  curSubQ,
  setCurSubQ,
  setMediaShown,
  required,
}: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [answers, setAnswers] = useState<TextOption[]>(
    (mod.value.question!.subquestions[curSubQ].options as TextOption[]).map(
      (option) => ({
        ...option,
        content: "",
      })
    )
  );

  function onSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMediaShown(false);
    dispatch(
      setStoreAnswers({
        answers: {
          ...mod.value.answers?.answers,
          [curSubQ]: {
            type: mod.value.question!.subquestions[curSubQ].type,
            qid: mod.value.question!.subquestions[curSubQ].id,
            content: [...answers],
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
              content: [...answers],
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
        mod.value.answers?.answers[curSubQ].content &&
        mod.value.answers?.answers[curSubQ].content.length <= 0) ? (
        <Unanswered
          answeredOptions={answers}
          setAnsweredOptions={setAnswers}
          required={required}
          onSubmit={onSubmit}
          q={mod.value.question!.subquestions[curSubQ]}
        />
      ) : (
        <Answered
          a={mod.value.answers.answers[curSubQ].content}
          onUnsubmit={onUnsubmit}
        />
      )}
    </>
  );
}
