import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import ChoiceButton from "@/features/live/components/ChoiceButton";
import { FaCheck, FaXmark } from "react-icons/fa6";

type Props = {
  className?: string;
  q?: Question;
  a?: MatchingAnswer[];
};

export default function Matching({ className = "", q, a }: Props) {
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [answers, setAnswers] = useState<MatchingAnswer[]>(
    a ? a : mod.value.answers ? mod.value.answers?.answers : []
  );
  const [isExpanded, setExpanded] = useState<boolean>(true);
  const [cur, setCur] = useState<number>(0);

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
      className={`grid gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] ${className} ${
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
            <BaseAccordion.Head>
              Your answer{answers.length > 1 ? "s" : ""}
            </BaseAccordion.Head>
            <BaseAccordion.Body className="relative w-full h-full">
              {answers.map((a, i) => (
                <div
                  key={a.prompt}
                  className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full"
                  style={{
                    transform: `translate(${(i - cur) * 100}%, 0%)`,
                  }}
                >
                  <p className="font-sans-serif text-[1em] truncate !w-3/4 sm:max-w-[30vw] text-center">
                    {i + 1}&#46;&nbsp;
                    {
                      (question!.options as MatchingOption).prompts.find(
                        (o) => o.id === a.prompt
                      )?.content
                    }
                  </p>
                  <ChoiceButton
                    className={`relative !w-3/4 sm:max-w-[30vw] !h-fit aspect-[4/3] text-[1.25em] leading-snug ring-4 z-1 ${
                      a.correct ? "ring-apple/50" : "ring-scarlet/50"
                    }`}
                    style={{
                      backgroundColor: mod.value.config.option.colorless
                        ? "#faf7ee"
                        : (question!.options as MatchingOption).options.find(
                            (o) => o.id === a.option
                          )?.color,
                    }}
                    areDetailsShown
                    disabled
                  >
                    <ChoiceButton.Content>
                      {
                        (question!.options as MatchingOption).options.find(
                          (o) => o.id === a.option
                        )?.content
                      }
                      {a.correct ? (
                        <FaCheck className="absolute top-1 left-1 min-w-[1em] min-h-[1em] text-apple" />
                      ) : (
                        <FaXmark className="absolute top-1 left-1 min-w-[1em] min-h-[1em] text-scarlet" />
                      )}
                    </ChoiceButton.Content>
                  </ChoiceButton>
                  <p className="font-sans-serif text-[0.75em] font-medium leading-snug">
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
