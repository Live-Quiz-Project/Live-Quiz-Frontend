import { MathJax } from "better-react-mathjax";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type Props = {
  className?: string;
  a?: TextOption[];
};

export default function FillBlank({ className = "", a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [answers, setAnswers] = useState<TextOption[]>(
    a ? a : mod.value.answers
  );
  const [isExpanded, setExpanded] = useState<boolean>(true);
  const [cur, setCur] = useState<number>(0);

  useEffect(() => {
    if (a) {
      setAnswers(a);
    } else {
      setAnswers(mod.value.answers);
    }
  }, [a]);

  return (
    <div
      className={`bg-quartz grid grid-rows-[auto_1fr] gap-[1em] justify-items-center items-center w-full h-full overflow-auto ${className}`}
    >
      <div className="grid grid-cols-[auto_1fr] gap-[1em] xs:gap-[1.5em] items-center font-serif overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
        <div className="flex items-center h-[3em] truncate w-[115%]">
          <p className="text-[2.25em] !-rotate-[25deg] text-denim">A</p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          Fill in the blanks
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
          <BaseAccordion.Head>
            Correct answer{answers.length > 1 ? "s" : ""}
          </BaseAccordion.Head>
          <BaseAccordion.Body className="relative w-full h-full">
            {answers.map((a, i) => (
              <div
                key={a.id}
                className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full font-sans-serif"
                style={{
                  transform: `translate(${(i - cur) * 100}%, 0%)`,
                }}
              >
                <span className="inline-flex items-center justify-center w-[2em] h-[2em] rounded-full bg-beige border-2 font-sans-serif">
                  {String.fromCharCode(65 + i)}
                </span>
                <p className="text-[1.5em] break-all font-medium leading-snug">
                  {a.content}
                </p>
                {a.caseSensitive && (
                  <p className="text-denim text-[0.85em] font-bold">
                    Case Sensitive
                  </p>
                )}
                <p className="font-sans-serif text-[0.75em]">
                  {a.mark} Mark{a.mark > 1 ? "s" : ""}
                </p>
              </div>
            ))}
            {cur > 0 && (
              <button
                onClick={() => setCur(cur - 1)}
                className="absolute top-1/2 -translate-y-1/2 left-0"
              >
                <IoChevronBack className="w-5 h-5" />
              </button>
            )}
            {cur < answers.length - 1 && (
              <button
                onClick={() => setCur(cur + 1)}
                className="absolute top-1/2 -translate-y-1/2 right-0"
              >
                <IoChevronForward className="w-5 h-5" />
              </button>
            )}
          </BaseAccordion.Body>
        </BaseAccordion>
      </div>
    </div>
  );
}
