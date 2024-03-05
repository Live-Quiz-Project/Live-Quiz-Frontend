import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { FaCheck, FaXmark } from "react-icons/fa6";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import ChoiceButton from "@/features/live/components/ChoiceButton";

type Props = {
  a?: ChoiceOption;
};

export default function Correct({ a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [isExpanded, setExpanded] = useState<boolean>(true);
  const [answer, setAnswer] = useState<ChoiceOption>(
    a ? a : (mod.value.answers as ChoiceOption[])[0]
  );

  useEffect(() => {
    if (a) {
      setAnswer(a);
    } else {
      setAnswer((mod.value.answers as ChoiceOption[])[0]);
    }
  }, [a]);

  return (
    <div
      className={`grid w-full h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 transition-all duration-300 overflow-hidden content-center ${
        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <BaseAccordion
        className={`px-2 xs:px-6 m-auto text-[1.25em] font-serif bg-jordy-blue/50 rounded-2xl w-full sm:w-4/5 h-full border overflow-hidden transition-all duration-300 ${
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
          <div className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full">
            <ChoiceButton
              className="!w-3/4 sm:max-w-[30vw] !h-fit aspect-[4/3] text-[1.25em] leading-snug"
              style={{
                backgroundColor: mod.value.config.option.colorless
                  ? "#faf7ee"
                  : answer.color,
              }}
              areDetailsShown
              disabled
            >
              <ChoiceButton.Content>
                {answer.content === "True" ? (
                  <FaCheck className="size-[1em]" />
                ) : answer.content === "False" ? (
                  <FaXmark className="size-[1em]" />
                ) : (
                  answer.content
                )}
              </ChoiceButton.Content>
            </ChoiceButton>
            <p className="font-sans-serif text-[1em]">
              {answer.mark} Mark
              {answer.mark > 1 ? "s" : ""}
            </p>
          </div>
        </BaseAccordion.Body>
      </BaseAccordion>
    </div>
  );
}
