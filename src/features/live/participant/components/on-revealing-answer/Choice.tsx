import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import ChoiceButton from "@/features/live/components/ChoiceButton";
import { MathJax } from "better-react-mathjax";

export default function Choice() {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <div className="bg-quartz grid grid-rows-[auto_1fr] gap-[1em] justify-items-center items-center h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
      <div className="flex items-center justify-center w-full">
        <div className="grid grid-cols-[auto_1fr] gap-[1em] xs:gap-[1.5em] items-center font-serif">
          <div className="flex items-center h-[2.75em] truncate w-[115%]">
            <p className="text-[2.25em] !-rotate-[25deg] text-denim">A</p>
          </div>
          <MathJax className="text-center text-[1.75em] leading-tight truncate">
            {mod.value.question!.content}
          </MathJax>
        </div>
      </div>
      <BaseAccordion
        className="p-6 mx-auto text-[1.25em] font-serif bg-jordy-blue/50 rounded-2xl container w-full h-fit sm:w-4/5 max-h-full overflow-auto"
        init={true}
      >
        <BaseAccordion.Head>
          Your answer{mod.value.answers.answers.length > 0 ? "s" : ""}
        </BaseAccordion.Head>
        <BaseAccordion.Body className="flex flex-wrap justify-center gap-[1vw]">
          {(mod.value.answers.answers as ChoiceOption[]).map((a) => (
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
  );
}
