import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import QuestionTypesEnum from "@/common/utils/question-types";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Choice from "@/features/live/participant/components/on-revealing-answer/Choice";
import TrueFalse from "@/features/live/participant/components/on-revealing-answer/TrueFalse";
import FillBlank from "@/features/live/participant/components/on-revealing-answer/FillBlank";
import Paragraph from "@/features/live/participant/components/on-revealing-answer/Paragraph";
import Matching from "@/features/live/participant/components/on-revealing-answer/Matching";
import { BiSwim } from "react-icons/bi";

export default function Pool() {
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [curSubQ, setCurSubQ] = useState<number>(0);

  return (
    <div className="grid grid-rows-[1fr_auto] gap-[1em] relative p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] w-full h-full">
      <div className="bg-koromiko/25 rounded-2xl xs:rounded-3xl w-full h-full grid grid-rows-[auto_1fr]">
        <div className="w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-[1em]">
          <BiSwim className="mx-auto text-sienna size-[2em] xs:size-[3em]" />
        </div>
        <div className="w-full h-full">
          {mod.value.answers &&
          mod.value.answers.answers &&
          mod.value.answers.answers.hasOwnProperty(curSubQ) ? (
            <>
              {mod.value.answers.answers[curSubQ].type ===
                QuestionTypesEnum.CHOICE && (
                <Choice
                  className="!pt-0"
                  q={mod.value.question!.subquestions[curSubQ]}
                  a={mod.value.answers.answers[curSubQ].content}
                />
              )}
              {mod.value.answers.answers[curSubQ].type ===
                QuestionTypesEnum.TRUE_FALSE && (
                <TrueFalse
                  className="!pt-0"
                  q={mod.value.question!.subquestions[curSubQ]}
                  a={mod.value.answers.answers[curSubQ].content}
                />
              )}
              {mod.value.answers.answers[curSubQ].type ===
                QuestionTypesEnum.FILL_BLANK && (
                <FillBlank
                  className="!pt-0"
                  a={mod.value.answers.answers[curSubQ].content}
                />
              )}
              {mod.value.answers.answers[curSubQ].type ===
                QuestionTypesEnum.PARAGRAPH && (
                <Paragraph
                  className="!pt-0"
                  q={mod.value.question!.subquestions[curSubQ]}
                  a={mod.value.answers.answers[curSubQ].content}
                />
              )}
              {mod.value.answers.answers[curSubQ].type ===
                QuestionTypesEnum.MATCHING && (
                <Matching
                  className="!pt-0"
                  q={mod.value.question!.subquestions[curSubQ]}
                  a={mod.value.answers.answers[curSubQ].content}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <em className="m-auto font-sans-serif text-[1.25em] text-regent-gray">
                You didn't answer &#58;&#40;
              </em>
            </div>
          )}
        </div>
      </div>
      {curSubQ > 0 && (
        <button
          onClick={() => setCurSubQ((prev) => prev - 1)}
          className="absolute top-1/2 -translate-y-1/2 left-[0.5%]"
        >
          <IoChevronBack className="w-5 h-5" />
        </button>
      )}
      {curSubQ < mod.value.question!.subquestions.length - 1 && (
        <button
          onClick={() => setCurSubQ((prev) => prev + 1)}
          className="absolute top-1/2 -translate-y-1/2 right-[0.5%]"
        >
          <IoChevronForward className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col justify-center items-center font-sans-serif text-[1.25em] gap-[0.1em]">
        <p className="text-[0.85em]">
          {mod.value.answers && mod.value.answers.marks
            ? mod.value.answers.marks
            : 0}
          &nbsp;Mark
          {mod.value.answers && mod.value.answers.marks > 1 ? "s" : ""}
        </p>
        <p>
          Total&#58;&nbsp;
          {auth.value.participant.marks ? auth.value.participant.marks : 0}
          &nbsp;Mark
          {auth.value.participant.marks > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
