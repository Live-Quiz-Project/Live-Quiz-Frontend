import { useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { trigger } from "@/features/live/store/lqs-slice";
import { useDispatch } from "react-redux";
import { MathJax } from "better-react-mathjax";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import FilledButton from "@/common/components/buttons/FilledButton";
import wsActions from "@/features/live/utils/action-types";
import ChoiceButton from "@/features/live/components/ChoiceButton";

export default function Answered() {
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [cur, setCur] = useState<number>(0);

  function onUnsubmit() {
    dispatch(trigger({ type: wsActions.UNSUBMIT_ANSWER }));
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
      <div className="grid grid-cols-[auto_1fr] gap-[1em] items-center font-serif">
        <div className="flex items-center h-[3em] font-serif truncate">
          <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
            ?
          </p>
        </div>
        <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
          {mod.value.question!.content}
        </MathJax>
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-[1em] font-serif text-center w-full h-full my-auto overflow-hidden">
        <p className="text-[1.15em]">Wait for others to answer...</p>
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
            <BaseAccordion.Head>
              Your answer{mod.value.answers.answers.length > 1 ? "s" : ""}
            </BaseAccordion.Head>
            <BaseAccordion.Body className="relative w-full h-full">
              {(mod.value.answers.answers as MatchingAnswer[]).map((a, i) => (
                <div
                  key={a.prompt}
                  className="absolute flex flex-col space-y-2 justify-center items-center transition-all duration-300 w-full h-full"
                  style={{
                    transform: `translate(${(i - cur) * 100}%, 0%)`,
                  }}
                >
                  <p className="font-sans-serif text-[1em] font-light truncate !w-3/4 sm:max-w-[30vw] text-center">
                    {i + 1}&#46;&nbsp;
                    {
                      (
                        mod.value.question!.options as MatchingOption
                      ).prompts.find((o) => o.id === a.prompt)?.content
                    }
                  </p>
                  <ChoiceButton
                    className="!w-3/4 sm:max-w-[30vw] !h-fit aspect-[4/3] text-[1.25em] leading-snug font-sans-serif"
                    style={{
                      backgroundColor: mod.value.config.option.colorless
                        ? "#faf7ee"
                        : (
                            mod.value.question!.options as MatchingOption
                          ).options.find((o) => o.id === a.option)?.color,
                    }}
                    areDetailsShown
                    disabled
                  >
                    <ChoiceButton.Content>
                      {
                        (
                          mod.value.question!.options as MatchingOption
                        ).options.find((o) => o.id === a.option)?.content
                      }
                    </ChoiceButton.Content>
                  </ChoiceButton>
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
              {cur < mod.value.answers.answers.length - 1 && (
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
        <p className="font-sans-serif text-[1.25em]">
          You took {mod.value.answers.time / 10} second
          {mod.value.answers.time / 10 > 1 ? "s" : ""}
        </p>
      </div>
      <FilledButton
        className={`bg-dune text-white font-sans-serif w-fit ${
          mod.value.config.participant.reanswer ? "opacity-100" : "opacity-0"
        }`}
        onClick={onUnsubmit}
        disabled={!mod.value.config.participant.reanswer}
      >
        Unsubmit
      </FilledButton>
    </div>
  );
}
