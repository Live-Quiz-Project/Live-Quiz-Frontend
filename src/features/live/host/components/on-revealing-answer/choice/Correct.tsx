import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import ChoiceButton from "@/features/live/components/ChoiceButton";

type Props = {
  a?: ChoiceOption[];
};

export default function Correct({ a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [answers, setAnswers] = useState<ChoiceOption[]>(
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
          {(answers as ChoiceOption[]).map((a, i) => (
            <div
              key={a.id}
              className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full"
              style={{
                transform: `translate(${(i - cur) * 100}%, 0%)`,
              }}
            >
              <ChoiceButton
                key={a.id}
                className="!w-3/4 sm:max-w-[30vw] !h-fit aspect-[4/3] text-[1.25em] leading-snug"
                style={{
                  backgroundColor: mod.value.config.option.colorless
                    ? "#faf7ee"
                    : a.color,
                }}
                areDetailsShown
                disabled
              >
                <ChoiceButton.Content>{a.content}</ChoiceButton.Content>
              </ChoiceButton>
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
  );
}
