import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { trigger } from "@/features/live/store/lqs-slice";
import { useDispatch } from "react-redux";
import { MathJax } from "better-react-mathjax";
import { FaCheck, FaXmark } from "react-icons/fa6";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import FilledButton from "@/common/components/buttons/FilledButton";
import wsActions from "@/features/live/utils/action-types";
import ChoiceButton from "@/features/live/components/ChoiceButton";

type Props = {
  q?: Question;
  a?: ChoiceOption;
  onUnsubmit?: () => void;
};

export default function Answered({ q, a, onUnsubmit: propOnUnsubmit }: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [answer, setAnswer] = useState<ChoiceOption>(
    a ? a : mod.value.answers.answers[0]
  );
  const [isExpanded, setExpanded] = useState<boolean>(false);

  function onUnsubmit() {
    dispatch(trigger({ type: wsActions.UNSUBMIT_ANSWER }));
  }

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }

    if (a) {
      setAnswer(a);
    } else {
      setAnswer(mod.value.answers.answers[0]);
    }
  }, [q, a]);

  return (
    <div
      className={`grid grid-rows-[auto_1fr_auto] gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] ${
        a ? "bg-koromiko/25" : ""
      }`}
    >
      <div className="grid grid-cols-[auto_1fr] gap-[1em] items-center font-serif">
        <div className="flex items-center h-[3em] font-serif truncate">
          <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
            ?
          </p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          {question!.content}
        </MathJax>
      </div>
      <div
        className={`grid gap-[1em] font-serif text-center w-full h-full my-auto overflow-hidden ${
          a ? "grid-rows-1" : "grid-rows-[auto_1fr]"
        }`}
      >
        {!a && <p className="text-[1.15em]">Wait for others to answer...</p>}
        <div
          className={`grid w-full h-full transition-all duration-300 overflow-hidden content-center ${
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
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
                key={answer.id}
                className="absolute flex justify-center items-center transition-all duration-300 w-full h-full"
              >
                <ChoiceButton
                  key={answer.id}
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
              </div>
            </BaseAccordion.Body>
          </BaseAccordion>
        </div>
        {mod.value.answers.time && (
          <p className="font-sans-serif text-[1.25em]">
            You took {mod.value.answers.time / 10} second
            {mod.value.answers.time / 10 > 1 ? "s" : ""}
          </p>
        )}
      </div>
      <FilledButton
        className={`bg-dune text-white font-sans-serif w-fit ${
          mod.value.config.participant.reanswer ? "opacity-100" : "opacity-0"
        }`}
        onClick={propOnUnsubmit ? propOnUnsubmit : onUnsubmit}
        disabled={!mod.value.config.participant.reanswer}
      >
        Unsubmit
      </FilledButton>
    </div>
  );
}
