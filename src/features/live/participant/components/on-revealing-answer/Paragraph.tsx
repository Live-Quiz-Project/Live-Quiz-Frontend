import { useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import { FaCheck, FaXmark } from "react-icons/fa6";

export default function Paragraph() {
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [isExpanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-[1em] justify-items-center items-center w-full h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
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
              {mod.value.answers.answers &&
              (mod.value.answers.answers as TextOption[]).length > 0 ? (
                <div className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full font-sans-serif text-center">
                  <div
                    className={`flex items-center space-x-[0.25em] text-[1.5em] ${
                      (mod.value.answers.answers as TextOption[])[0].correct
                        ? "text-apple"
                        : "text-scarlet"
                    }`}
                  >
                    {(mod.value.answers.answers as TextOption[])[0].correct ? (
                      <FaCheck className="min-w-[1em] min-h-[1em]" />
                    ) : (
                      <FaXmark className="min-w-[1em] min-h-[1em]" />
                    )}
                    <p className="text-[1em] break-all font-medium leading-snug">
                      {(mod.value.answers.answers as TextOption[])[0].content}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="w-full text-[1em] break-all">
                      Answer&#58;&nbsp;
                      <em>
                        {(mod.value.answers.answers as TextOption[])[0].answer}
                      </em>
                    </p>
                    {(mod.value.answers.answers as TextOption[])[0]
                      .caseSensitive ? (
                      <p className="text-sienna text-[0.75em] font-bold">
                        Case Sensitive
                      </p>
                    ) : (
                      <em className="text-regent-gray text-[0.75em]">
                        Case Insensitive
                      </em>
                    )}
                  </div>
                </div>
              ) : (
                <div className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full font-sans-serif text-center">
                  <div className="flex items-center space-x-[0.25em] text-[1.5em]">
                    <p className="text-[1em] break-all font-medium leading-snug">
                      {mod.value.answers}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-[1em] font-sans-serif text-regent-gray/50">
                      No correct answer
                    </p>
                  </div>
                </div>
              )}
            </BaseAccordion.Body>
          </BaseAccordion>
        ) : (
          <em className="m-auto font-sans-serif text-[1.25em]">
            You didn't answer &#58;&#40;
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
