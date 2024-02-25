import { useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import { FaXmark, FaCheck, FaQuestion } from "react-icons/fa6";
import ChoiceButton from "@/features/live/components/ChoiceButton";

export default function Choice() {
  const mod = useTypedSelector((state) => state.mod);
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const optionsContainerGridFormat =
    mod.value.question!.layout === 0
      ? `${
          (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "grid-rows-3"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "grid-rows-4"
            : "grid-rows-10"
        } grid-flow-col auto-cols-fr auto-cols ${
          (mod.value.question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:row-start-5"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:row-start-4"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:row-start-3"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:row-start-2"
            : null
        }`
      : mod.value.question!.layout === 1
      ? `grid-cols-4 auto-rows-fr ${
          (mod.value.question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:col-start-2"
            : ""
        }`
      : mod.value.question!.layout === 2
      ? `grid-rows-4 grid-flow-col auto-cols-fr auto-cols ${
          (mod.value.question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:row-start-2"
            : ""
        }`
      : `${
          (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "grid-cols-3"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "grid-cols-4"
            : "grid-cols-10"
        } auto-rows-fr ${
          (mod.value.question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:col-start-5"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:col-start-4"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:col-start-3"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:col-start-2"
            : null
        }`;
  const choiceButtonGridFormat =
    mod.value.question!.layout === 0
      ? `${
          (mod.value.question!.options as ChoiceOption[]).length === 1
            ? "row-span-10 !row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 2
            ? "row-span-5 first:!row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "row-span-1 first:!row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "row-span-1 first:!row-start-1"
            : "row-span-2"
        }`
      : mod.value.question!.layout === 1
      ? (mod.value.question!.options as ChoiceOption[]).length === 1
        ? "col-span-4 !col-start-1"
        : "col-span-2"
      : mod.value.question!.layout === 2
      ? (mod.value.question!.options as ChoiceOption[]).length === 1
        ? "row-span-4 !row-start-1"
        : "row-span-2"
      : (mod.value.question!.options as ChoiceOption[]).length === 1
      ? "col-span-10 !col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 2
      ? "col-span-5 first:!col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 3
      ? "col-span-1 first:!col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 4
      ? "col-span-1 first:!col-start-1"
      : "col-span-2";

  return (
    <div
      className={`flex-1 grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      <div
        className={`grid items-start gap-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 ${
          isQuestionExpanded ? "grid-cols-[1fr_0fr]" : "grid-cols-[1fr_auto]"
        }`}
      >
        {!isNoteExpanded && (
          <button
            type="button"
            onClick={() => setQuestionExpanded((prev) => !prev)}
            className={`grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[2.75em] max-h-full ${
              isQuestionExpanded
                ? "col-span-2 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            }`}
          >
            <div className="flex items-center h-[2.75em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-denim">
                ?
              </p>
            </div>
            <MathJax
              className={`text-left text-[1.75em] w-full leading-tight ${
                isQuestionExpanded ? "pt-[0.15em]" : "truncate"
              }`}
            >
              {mod.value.question!.content}
            </MathJax>
          </button>
        )}
        {!isQuestionExpanded && (
          <button
            type="button"
            onClick={() => {
              setNoteExpanded((prev) => !prev);
              setNoteFirstOpened(false);
            }}
            className={`grid gap-[1em] font-serif min-h-[2.75em] max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-2 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "grid-cols-1 items-center"
            }`}
          >
            {isNoteExpanded && (
              <MathJax className="text-left text-[1.75em] w-full leading-tight">
                {mod.value.question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-[2.75em] text-denim flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="w-full h-[2em]" />
              ) : (
                <AiOutlineMessage className="w-full h-[2em]" />
              )}
              {mod.value.question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        )}
      </div>
      <div className="w-full h-full overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0">
        <div
          className={`grid justify-items-center h-full w-full gap-2 sm:gap-4 2xl:gap-[1vw] tracking-tight ${optionsContainerGridFormat}`}
        >
          {mod.value.question!.options.map((option, i) => (
            <ChoiceButton
              key={(option as ChoiceOption).id}
              className={`text-[1.25em] p-2 sm:p-4 2xl:p-[0.6em] ${choiceButtonGridFormat}`}
              style={{ backgroundColor: (option as ChoiceOption).color }}
              areDetailsShown
              disabled
            >
              <ChoiceButton.Icon>
                {i === 0 && <FaCheck className="w-4 h-4" />}
                {i === 1 && <FaXmark className="w-4 h-4" />}
                {i === 2 && <FaQuestion className="w-4 h-4" />}
              </ChoiceButton.Icon>
              <ChoiceButton.Content>
                {(option as ChoiceOption).content}
              </ChoiceButton.Content>
            </ChoiceButton>
          ))}
        </div>
      </div>
    </div>
  );
}
