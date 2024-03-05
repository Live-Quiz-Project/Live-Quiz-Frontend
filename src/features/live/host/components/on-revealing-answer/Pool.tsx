import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import QuestionTypesEnum from "@/common/utils/question-types";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Choice from "@/features/live/host/components/on-revealing-answer/choice";
import TrueFalse from "@/features/live/host/components/on-revealing-answer/true-false";
import FillBlank from "@/features/live/host/components/on-revealing-answer/FillBlank";
import Paragraph from "@/features/live/host/components/on-revealing-answer/Paragraph";
import Matching from "@/features/live/host/components/on-revealing-answer/Matching";
import { BiSwim } from "react-icons/bi";

export default function Pool() {
  const mod = useTypedSelector((state) => state.mod);
  const [curSubQ, setCurSubQ] = useState<number>(0);

  return (
    <div className="relative bg-quartz p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] w-full h-full">
      <div className="bg-jordy-blue rounded-2xl xs:rounded-3xl w-full h-full grid grid-rows-[auto_1fr]">
        <div className="w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-[1em]">
          <BiSwim className="mx-auto text-denim size-[2em] xs:size-[3em]" />
        </div>
        <div className="w-full h-full">
          {mod.value.answers[curSubQ].type === QuestionTypesEnum.CHOICE && (
            <Choice
              className="[&>div:first-of-type]:!pt-0 bg-transparent [&_#accordion]:bg-quartz/50 [&_#reveal-mode-toggler]:text-quartz"
              q={mod.value.question!.subquestions[curSubQ]}
              a={mod.value.answers[curSubQ].content}
            />
          )}
          {mod.value.answers[curSubQ].type === QuestionTypesEnum.TRUE_FALSE && (
            <TrueFalse
              className="[&>div:first-of-type]:!pt-0 bg-transparent [&_#accordion]:bg-quartz/50 [&_#reveal-mode-toggler]:text-quartz"
              q={mod.value.question!.subquestions[curSubQ]}
              a={mod.value.answers[curSubQ].content}
            />
          )}
          {mod.value.answers[curSubQ].type === QuestionTypesEnum.FILL_BLANK && (
            <FillBlank
              className="[&>div:first-of-type]:!pt-0 bg-transparent [&_#accordion]:bg-quartz/50"
              a={mod.value.answers[curSubQ].content}
            />
          )}
          {mod.value.answers[curSubQ].type === QuestionTypesEnum.PARAGRAPH && (
            <Paragraph
              className="[&>div:first-of-type]:!pt-0 bg-transparent [&_#accordion]:bg-quartz/50"
              q={mod.value.question!.subquestions[curSubQ]}
              a={mod.value.answers[curSubQ].content}
            />
          )}
          {mod.value.answers[curSubQ].type === QuestionTypesEnum.MATCHING && (
            <Matching
              className="[&>div:first-of-type]:!pt-0 bg-transparent [&_#accordion]:bg-quartz/50"
              q={mod.value.question!.subquestions[curSubQ]}
              a={mod.value.answers[curSubQ].content}
            />
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
      {curSubQ < mod.value.answers.length - 1 && (
        <button
          onClick={() => setCurSubQ((prev) => prev + 1)}
          className="absolute top-1/2 -translate-y-1/2 right-[0.5%]"
        >
          <IoChevronForward className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
