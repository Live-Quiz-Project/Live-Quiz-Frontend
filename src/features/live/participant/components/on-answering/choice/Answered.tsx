import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { trigger } from "@/features/live/store/lqs-slice";
import { useDispatch } from "react-redux";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import FilledButton from "@/common/components/buttons/FilledButton";
import wsActions from "@/features/live/utils/action-types";
import { MathJax } from "better-react-mathjax";
import ChoiceButton from "@/features/live/components/ChoiceButton";

export default function Answered() {
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);

  function onUnsubmit() {
    dispatch(trigger({ type: wsActions.UNSUBMIT_ANSWER }));
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
      <div className="grid grid-cols-[auto_1fr] gap-[1em] items-center font-serif">
        <div className="flex items-center h-[2.75em] font-serif truncate">
          <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
            ?
          </p>
        </div>
        <MathJax className="text-center text-[1.75em] w-full leading-tight truncate">
          {mod.value.question!.content}
        </MathJax>
      </div>
      <div className="grid grid-rows-[auto_auto] gap-[1em] font-serif text-center w-full h-full my-auto overflow-hidden">
        <p className="text-[1.15em]">Wait for others to answer...</p>
        <BaseAccordion className="p-6 mx-auto text-[1.25em] bg-karry rounded-2xl container w-full h-fit sm:w-4/5 max-h-full overflow-auto">
          <BaseAccordion.Head>
            Your answer{mod.value.answers.length > 0 ? "s" : ""}
          </BaseAccordion.Head>
          <BaseAccordion.Body className="flex flex-wrap justify-center gap-[1vw]">
            {(mod.value.answers as ChoiceOption[]).map((a) => (
              <ChoiceButton
                key={a.id}
                className="text-[1.25em] p-2 sm:p-4 2xl:p-[0.6em] !w-4/5 sm:!w-1/3 aspect-[4/3] leading-snug"
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
            ))}
          </BaseAccordion.Body>
        </BaseAccordion>
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
