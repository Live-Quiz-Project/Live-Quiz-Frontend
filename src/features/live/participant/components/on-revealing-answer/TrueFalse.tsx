import { useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { FaCheck, FaXmark } from "react-icons/fa6";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import ChoiceButton from "@/features/live/components/ChoiceButton";

export default function TrueFalse() {
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [isExpanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
      <div className="grid grid-cols-[auto_1fr] gap-[1em] items-center font-serif">
        <div className="flex items-center h-[3em] truncate w-[115%]">
          <p className="text-[2.25em] !-rotate-[25deg] text-sienna">A</p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          {mod.value.question!.content}
        </MathJax>
      </div>
      <div
        className={`grid w-full h-full transition-all duration-300 overflow-hidden content-center ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        {mod.value.answers ? (
          <BaseAccordion
            className={`border px-2 xs:px-6 m-auto text-[1.25em] font-serif bg-karry rounded-2xl w-full sm:w-4/5 h-full overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "py-4 xs:py-6 grid grid-rows-[auto_1fr]"
                : "py-8 grid grid-rows-[auto_1fr] items-center justify-items-center"
            }`}
            init={true}
            isExpanded={isExpanded}
            setExpanded={setExpanded}
          >
            <BaseAccordion.Head>Your answer</BaseAccordion.Head>
            <BaseAccordion.Body className="relative w-full h-full">
              <div
                key={mod.value.answers.answers[0].id}
                className="absolute flex justify-center items-center transition-all duration-300 w-full h-full"
              >
                <ChoiceButton
                  className={`relative !w-3/4 sm:max-w-[30vw] !h-fit aspect-[4/3] text-[1.25em] leading-snug ring-4 z-1 ${
                    mod.value.answers.answers[0].correct
                      ? "ring-apple/50"
                      : "ring-scarlet/50"
                  }`}
                  style={{
                    backgroundColor: mod.value.config.option.colorless
                      ? "#faf7ee"
                      : mod.value.answers.answers[0].color,
                  }}
                  areDetailsShown
                  disabled
                >
                  <ChoiceButton.Content>
                    {mod.value.answers.answers[0].content === "True" ? (
                      <FaCheck className="size-[1em]" />
                    ) : mod.value.answers.answers[0].content === "False" ? (
                      <FaXmark className="size-[1em]" />
                    ) : (
                      mod.value.answers.answers[0].content
                    )}
                    {mod.value.answers.answers[0].correct ? (
                      <FaCheck className="absolute top-1 left-1 min-w-[1em] min-h-[1em] text-apple" />
                    ) : (
                      <FaXmark className="absolute top-1 left-1 min-w-[1em] min-h-[1em] text-scarlet" />
                    )}
                  </ChoiceButton.Content>
                </ChoiceButton>
              </div>
            </BaseAccordion.Body>
          </BaseAccordion>
        ) : (
          <em className="m-auto font-sans-serif text-[1.25em]">
            You didn't answer :(
          </em>
        )}
      </div>
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
