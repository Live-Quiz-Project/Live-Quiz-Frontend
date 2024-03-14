import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import { FaCheck, FaXmark } from "react-icons/fa6";

type Props = {
  className?: string;
  q?: Question;
  a?: TextOption[];
};

export default function Paragraph({ className = "", q, a }: Props) {
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [answers, setAnswers] = useState<TextOption[]>(
    a ? a : mod.value.answers ? mod.value.answers?.answers : []
  );
  const [isExpanded, setExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }

    if (a) {
      setAnswers(a);
    } else {
      setAnswers(mod.value.answers ? mod.value.answers?.answers : []);
    }
  }, [q, a]);

  return (
    <div
      className={`grid gap-[1em] justify-items-center items-center w-full h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] ${className} ${
        a ? "grid-rows-[auto_1fr]" : "grid-rows-[auto_1fr_auto]"
      }`}
    >
      <div className="grid grid-cols-[auto_1fr] gap-[1em] items-center font-serif">
        <div className="flex items-center h-[3em] truncate w-[115%]">
          <p className="text-[2.25em] !-rotate-[25deg] text-sienna">A</p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          {question!.content}
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
              {answers && answers.length > 0 ? (
                <div className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full font-sans-serif text-center">
                  <div
                    className={`flex items-center space-x-[0.25em] text-[1.5em] ${
                      answers[0].correct ? "text-apple" : "text-scarlet"
                    }`}
                  >
                    {answers[0].correct ? (
                      <FaCheck className="min-w-[1em] min-h-[1em]" />
                    ) : (
                      <FaXmark className="min-w-[1em] min-h-[1em]" />
                    )}
                    <p className="text-[1em] break-all font-medium leading-snug">
                      {answers[0].content}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="w-full text-[1em] break-all">
                      Answer&#58;&nbsp;
                      <em>{answers[0].answer}</em>
                    </p>
                    {answers[0].caseSensitive && (
                      <p className="text-sienna text-[0.75em] font-bold">
                        Case Sensitive
                      </p>
                    )}
                  </div>
                  <p className="text-[0.75em]">
                    {answers[0].mark} Mark{answers[0].mark > 1 ? "s" : ""}
                  </p>
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
          <em className="m-auto font-sans-serif text-[1.25em] text-regent-gray">
            You didn't answer &#58;&#40;
          </em>
        )}
      </div>
      {!a && (
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
      )}
    </div>
  );
}
