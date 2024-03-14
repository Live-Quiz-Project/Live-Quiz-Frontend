import { MathJax } from "better-react-mathjax";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  q?: Question;
  a?: TextOption[];
};

export default function Paragraph({ className = "", q, a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [answers, setAnswers] = useState<TextOption[]>(
    a ? a : mod.value.answers
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
      setAnswers(mod.value.answers);
    }
  }, [q, a]);

  return (
    <div
      className={`bg-quartz grid grid-rows-[auto_1fr] gap-[1em] justify-items-center items-center w-full h-full overflow-auto ${className}`}
    >
      <div className="grid grid-cols-[auto_1fr] gap-[1em] xs:gap-[1.5em] items-center font-serif overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
        <div className="flex items-center h-[3em] truncate w-[115%]">
          <p className="text-[2.25em] !-rotate-[25deg] text-denim">A</p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          {question!.content}
        </MathJax>
      </div>
      <div
        className={`grid w-full h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 transition-all duration-300 overflow-hidden content-center ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <BaseAccordion
          className={`border px-2 xs:px-6 m-auto text-[1.25em] font-serif bg-jordy-blue/50 rounded-2xl w-full sm:w-4/5 h-full overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "py-4 xs:py-6 grid grid-rows-[auto_1fr]"
              : "py-8 grid grid-rows-[auto_1fr] items-center justify-items-center"
          }`}
          init={true}
          isExpanded={isExpanded}
          setExpanded={setExpanded}
        >
          <BaseAccordion.Head>Correct answer</BaseAccordion.Head>
          <BaseAccordion.Body className="relative w-full h-full">
            {answers && answers.length > 0 ? (
              <div className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full font-sans-serif">
                <p className="text-[1.5em] break-all font-medium leading-snug">
                  {answers[0].content}
                </p>
                {answers[0].caseSensitive && (
                  <p className="text-denim text-[0.85em] font-bold">
                    Case Sensitive
                  </p>
                )}
                <p className="m-auto font-sans-serif text-[0.75em]">
                  {answers[0].mark} Mark
                  {answers[0].mark > 1 ? "s" : ""}
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-[1em] font-sans-serif text-regent-gray">
                  No correct answer
                </p>
              </div>
            )}
          </BaseAccordion.Body>
        </BaseAccordion>
      </div>
    </div>
  );
}
