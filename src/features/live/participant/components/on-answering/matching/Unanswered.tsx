import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import DetailedOptionsSwitch from "../DetailedOptionsSwitch";
import ChoiceButton from "@/features/live/components/ChoiceButton";
import Draggable from "./Draggable";

type Props = {
  selectedOptions: { [x: string]: string };
  setSelectedOptions: Dispatch<SetStateAction<{ [x: string]: string }>>;
  options: (MatchingOptionOption & { eliminated: boolean })[];
  draggedOver: { [x: string]: boolean };
  notAllAnswered: boolean;
  setDraggedOver: Dispatch<SetStateAction<{ [x: string]: boolean }>>;
};

export default function Unanswered({
  selectedOptions,
  setSelectedOptions,
  options,
  draggedOver,
  notAllAnswered,
  setDraggedOver,
}: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const promptRefs = Array.from(
    { length: (mod.value.question!.options as MatchingOption).prompts.length },
    () => useRef<HTMLDivElement>(null)
  );
  const optionRefs = Array.from(
    { length: (mod.value.question!.options as MatchingOption).options.length },
    () => useRef<HTMLDivElement>(null)
  );
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const [areDetailsShown, setDetailsShown] = useState<boolean>(false);
  const optionsContainerGridFormat =
    mod.value.question!.layout === 0 || mod.value.question!.layout === 1
      ? (mod.value.question!.options as MatchingOption).prompts.length >
        (mod.value.question!.options as MatchingOption).options.length
        ? `grid-rows-${
            (mod.value.question!.options as MatchingOption).prompts.length * 2
          } grid-flow-col`
        : `grid-rows-${
            (mod.value.question!.options as MatchingOption).options.length * 2
          } grid-flow-col`
      : (mod.value.question!.options as MatchingOption).prompts.length >
        (mod.value.question!.options as MatchingOption).options.length
      ? `grid-cols-${
          (mod.value.question!.options as MatchingOption).prompts.length * 2
        } grid-flow-row`
      : `grid-cols-${
          (mod.value.question!.options as MatchingOption).options.length * 2
        } grid-flow-row`;
  const promptButtonGridFormat = `${
    mod.value.question!.layout === 0
      ? "row-span-2 col-start-1"
      : mod.value.question!.layout === 1
      ? "row-span-2 col-start-2"
      : mod.value.question!.layout === 2
      ? "col-span-2 row-start-1"
      : "col-span-2 row-start-2"
  } ${
    mod.value.question!.layout === 0 || mod.value.question!.layout === 1
      ? (mod.value.question!.options as MatchingOption).prompts.length <
        (mod.value.question!.options as MatchingOption).options.length
        ? (mod.value.question!.options as MatchingOption).options.length === 2
          ? "first:row-start-2"
          : (mod.value.question!.options as MatchingOption).options.length === 3
          ? (mod.value.question!.options as MatchingOption).prompts.length === 1
            ? "first:row-start-3"
            : "first:row-start-2"
          : (mod.value.question!.options as MatchingOption).options.length === 4
          ? (mod.value.question!.options as MatchingOption).prompts.length === 1
            ? "first:row-start-4"
            : (mod.value.question!.options as MatchingOption).prompts.length ===
              2
            ? "first:row-start-3 [&:nth-child(2)]:row-start-5"
            : "first:row-start-2 [&:nth-child(2)]:row-start-4 [&:nth-child(3)]:row-start-6"
          : (mod.value.question!.options as MatchingOption).options.length === 5
          ? (mod.value.question!.options as MatchingOption).prompts.length === 1
            ? "first:row-start-5"
            : (mod.value.question!.options as MatchingOption).prompts.length ===
              2
            ? "first:row-start-4 [&:nth-child(2)]:row-start-6"
            : (mod.value.question!.options as MatchingOption).prompts.length ===
              3
            ? "first:row-start-3 [&:nth-child(2)]:row-start-5 [&:nth-child(3)]:row-start-7"
            : "first:row-start-2 [&:nth-child(2)]:row-start-4 [&:nth-child(3)]:row-start-6 [&:nth-child(4)]:row-start-8"
          : (mod.value.question!.options as MatchingOption).prompts.length === 1
          ? "first:row-start-6"
          : (mod.value.question!.options as MatchingOption).prompts.length === 2
          ? "first:row-start-5 [&:nth-child(2)]:row-start-7"
          : (mod.value.question!.options as MatchingOption).prompts.length === 3
          ? "first:row-start-4 [&:nth-child(2)]:row-start-6 [&:nth-child(3)]:row-start-8"
          : (mod.value.question!.options as MatchingOption).prompts.length === 4
          ? "first:row-start-3 [&:nth-child(2)]:row-start-5 [&:nth-child(3)]:row-start-7 [&:nth-child(4)]:row-start-9"
          : "first:row-start-2 [&:nth-child(2)]:row-start-4 [&:nth-child(3)]:row-start-6 [&:nth-child(4)]:row-start-8 [&:nth-child(5)]:row-start-10"
        : ""
      : (mod.value.question!.options as MatchingOption).options.length >
        (mod.value.question!.options as MatchingOption).prompts.length
      ? (mod.value.question!.options as MatchingOption).options.length === 2
        ? "first:col-start-2"
        : (mod.value.question!.options as MatchingOption).options.length === 3
        ? (mod.value.question!.options as MatchingOption).prompts.length === 1
          ? "first:col-start-3"
          : "first:col-start-2"
        : (mod.value.question!.options as MatchingOption).options.length === 4
        ? (mod.value.question!.options as MatchingOption).prompts.length === 1
          ? "first:col-start-4"
          : (mod.value.question!.options as MatchingOption).prompts.length === 2
          ? "first:col-start-3 [&:nth-child(2)]:col-start-5"
          : "first:col-start-2 [&:nth-child(2)]:col-start-4 [&:nth-child(3))]:col-start-6"
        : (mod.value.question!.options as MatchingOption).options.length === 5
        ? (mod.value.question!.options as MatchingOption).prompts.length === 1
          ? "first:col-start-5"
          : (mod.value.question!.options as MatchingOption).prompts.length === 2
          ? "first:col-start-4 [&:nth-child(2)]:col-start-6"
          : (mod.value.question!.options as MatchingOption).prompts.length === 3
          ? "first:col-start-3 [&:nth-child(2)]:col-start-5 [&:nth-child(3)]:col-start-7"
          : "first:col-start-2 [&:nth-child(2)]:col-start-4 [&:nth-child(3)]:col-start-6 [&:nth-child(4)]:col-start-8"
        : (mod.value.question!.options as MatchingOption).prompts.length === 1
        ? "first:col-start-6"
        : (mod.value.question!.options as MatchingOption).prompts.length === 2
        ? "first:col-start-5 [&:nth-child(2)]:col-start-7"
        : (mod.value.question!.options as MatchingOption).prompts.length === 3
        ? "first:col-start-4 [&:nth-child(2)]:col-start-6 [&:nth-child(3)]:col-start-8"
        : (mod.value.question!.options as MatchingOption).prompts.length === 4
        ? "first:col-start-3 [&:nth-child(2)]:col-start-5 [&:nth-child(3)]:col-start-7 [&:nth-child(4)]:col-start-9"
        : "first:col-start-2 [&:nth-child(2)]:col-start-4 [&:nth-child(3)]:col-start-6 [&:nth-child(4)]:col-start-8 [&:nth-child(5)]:col-start-10"
      : ""
  }`;
  const optionButtonGridFormat = `${
    mod.value.question!.layout === 0
      ? "row-span-2 col-start-2"
      : mod.value.question!.layout === 1
      ? "row-span-2 col-start-1"
      : mod.value.question!.layout === 2
      ? "col-span-2 row-start-2"
      : "col-span-2 row-start-1"
  } ${
    mod.value.question!.layout === 0 || mod.value.question!.layout === 1
      ? (mod.value.question!.options as MatchingOption).prompts.length >
        (mod.value.question!.options as MatchingOption).options.length
        ? (mod.value.question!.options as MatchingOption).prompts.length === 2
          ? "[&:nth-child(3)]:row-start-2"
          : (mod.value.question!.options as MatchingOption).prompts.length === 3
          ? (mod.value.question!.options as MatchingOption).options.length === 1
            ? "[&:nth-child(4)]:row-start-3"
            : "[&:nth-child(4)]:row-start-2"
          : (mod.value.question!.options as MatchingOption).prompts.length === 4
          ? (mod.value.question!.options as MatchingOption).options.length === 1
            ? "[&:nth-child(5)]:row-start-4"
            : (mod.value.question!.options as MatchingOption).options.length ===
              2
            ? "[&:nth-child(5)]:row-start-3 [&:nth-child(6)]:row-start-5"
            : "[&:nth-child(5)]:row-start-2 [&:nth-child(6)]:row-start-4 [&:nth-child(7)]:row-start-6"
          : (mod.value.question!.options as MatchingOption).prompts.length === 5
          ? (mod.value.question!.options as MatchingOption).options.length === 1
            ? "[&:nth-child(6)]:row-start-5"
            : (mod.value.question!.options as MatchingOption).options.length ===
              2
            ? "[&:nth-child(6)]:row-start-4 [&:nth-child(7)]:row-start-6"
            : (mod.value.question!.options as MatchingOption).options.length ===
              3
            ? "[&:nth-child(6)]:row-start-3 [&:nth-child(7)]:row-start-5 [&:nth-child(8)]:row-start-7"
            : "[&:nth-child(6)]:row-start-2 [&:nth-child(7)]:row-start-4 [&:nth-child(8)]:row-start-6 [&:nth-child(9)]:row-start-8"
          : (mod.value.question!.options as MatchingOption).options.length === 1
          ? "[&:nth-child(7)]:row-start-6"
          : (mod.value.question!.options as MatchingOption).options.length === 2
          ? "[&:nth-child(7)]:row-start-5 [&:nth-child(8)]:row-start-7"
          : (mod.value.question!.options as MatchingOption).options.length === 3
          ? "[&:nth-child(7)]:row-start-4 [&:nth-child(8)]:row-start-6 [&:nth-child(9)]:row-start-8"
          : (mod.value.question!.options as MatchingOption).options.length === 4
          ? "[&:nth-child(7)]:row-start-3 [&:nth-child(8)]:row-start-5 [&:nth-child(9)]:row-start-7 [&:nth-child(10)]:row-start-9"
          : "[&:nth-child(7)]:row-start-2 [&:nth-child(8)]:row-start-4 [&:nth-child(9)]:row-start-6 [&:nth-child(10)]:row-start-8 [&:nth-child(11)]:row-start-10"
        : ""
      : (mod.value.question!.options as MatchingOption).prompts.length >
        (mod.value.question!.options as MatchingOption).options.length
      ? (mod.value.question!.options as MatchingOption).prompts.length === 2
        ? "[&:nth-child(3)]:col-start-2"
        : (mod.value.question!.options as MatchingOption).prompts.length === 3
        ? (mod.value.question!.options as MatchingOption).options.length === 1
          ? "[&:nth-child(4)]:col-start-3"
          : "[&:nth-child(4)]:col-start-2"
        : (mod.value.question!.options as MatchingOption).prompts.length === 4
        ? (mod.value.question!.options as MatchingOption).options.length === 1
          ? "[&:nth-child(5)]:col-start-4"
          : (mod.value.question!.options as MatchingOption).options.length === 2
          ? "[&:nth-child(5)]:col-start-3 [&:nth-child(6)]:col-start-5"
          : "[&:nth-child(5)]:col-start-2 [&:nth-child(6)]:col-start-4 [&:nth-child(7)]:col-start-6"
        : (mod.value.question!.options as MatchingOption).prompts.length === 5
        ? (mod.value.question!.options as MatchingOption).options.length === 1
          ? "[&:nth-child(6)]:col-start-5"
          : (mod.value.question!.options as MatchingOption).options.length === 2
          ? "[&:nth-child(6)]:col-start-4 [&:nth-child(7)]:col-start-6"
          : (mod.value.question!.options as MatchingOption).options.length === 3
          ? "[&:nth-child(6)]:col-start-3 [&:nth-child(7)]:col-start-5 [&:nth-child(8)]:col-start-7"
          : "[&:nth-child(6)]:col-start-2 [&:nth-child(7)]:col-start-4 [&:nth-child(8)]:col-start-6 [&:nth-child(9)]:col-start-8"
        : (mod.value.question!.options as MatchingOption).options.length === 1
        ? "[&:nth-child(7)]:col-start-6"
        : (mod.value.question!.options as MatchingOption).options.length === 2
        ? "[&:nth-child(7)]:col-start-5 [&:nth-child(8)]:col-start-7"
        : (mod.value.question!.options as MatchingOption).options.length === 3
        ? "[&:nth-child(7)]:col-start-4 [&:nth-child(8)]:col-start-6 [&:nth-child(9)]:col-start-8"
        : (mod.value.question!.options as MatchingOption).options.length === 4
        ? "[&:nth-child(7)]:col-start-3 [&:nth-child(8)]:col-start-5 [&:nth-child(9)]:col-start-7 [&:nth-child(10)]:col-start-9"
        : "[&:nth-child(7)]:col-start-2 [&:nth-child(8)]:col-start-4 [&:nth-child(9)]:col-start-6 [&:nth-child(10)]:col-start-8 [&:nth-child(11)]:col-start-10"
      : ""
  }`;

  return (
    <div
      className={`flex-1 grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      <div
        className={`relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 grid-rows-[1fr_auto] ${
          isQuestionExpanded
            ? "grid-cols-[1fr_0fr_0fr]"
            : "grid-cols-[1fr_0fr_auto]"
        }`}
      >
        {!isNoteExpanded && (
          <button
            type="button"
            onClick={() => setQuestionExpanded((prev) => !prev)}
            className={`group relative grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[3em] max-h-full ${
              isQuestionExpanded
                ? "col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            }`}
          >
            <span className="opacity-0 group-hover:opacity-100 absolute w-full h-full bg-beige rounded-full blur-lg transition-all duration-300" />
            <div className="flex items-center h-[3em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
                ?
              </p>
            </div>
            <MathJax
              className={`z-1 h-full tracking-tight font-medium text-left text-[1.75em] w-full ${
                isQuestionExpanded
                  ? "pt-[0.1em] leading-normal"
                  : "truncate leading-[1.75]"
              }`}
            >
              {mod.value.question!.content}
            </MathJax>
          </button>
        )}
        {!isQuestionExpanded && !isNoteExpanded && (
          <div className="flex items-center h-full">
            <DetailedOptionsSwitch
              areDetailsShown={areDetailsShown}
              setDetailsShown={setDetailsShown}
            />
          </div>
        )}
        {!isQuestionExpanded && (
          <button
            type="button"
            onClick={() => {
              setNoteExpanded((prev) => !prev);
              setNoteFirstOpened(false);
            }}
            className={`group grid gap-[1em] font-serif min-h-[3em] max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "grid-cols-1 items-center"
            }`}
          >
            {isNoteExpanded && (
              <MathJax
                className={`h-full tracking-tight font-medium text-left text-[1.75em] w-full ${
                  isNoteExpanded
                    ? "pt-[0.1em] leading-normal"
                    : "truncate leading-[1.75]"
                }`}
              >
                {mod.value.question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-[3em] text-sienna flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              ) : (
                <AiOutlineMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              )}
              {mod.value.question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        )}
        {notAllAnswered && (
          <p className="col-span-3 text-scarlet animate-bounce">
            Please match options to all prompts
          </p>
        )}
      </div>
      <div
        className={`grid auto-cols-fr auto-rows-fr justify-items-center gap-2 sm:gap-4 2xl:gap-[1vw] p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 ${optionsContainerGridFormat}`}
      >
        {(mod.value.question!.options as MatchingOption).prompts.map(
          (prompt, i) => (
            <div
              key={prompt.id}
              id={prompt.id}
              ref={promptRefs[i]}
              className={`relative w-full h-full rounded-lg lg:rounded-xl 2xl:rounded-[1vw] border-dashed !border-[3px] border-karry ${promptButtonGridFormat}  ${
                draggedOver[prompt.id as keyof typeof draggedOver]
                  ? "bg-dune/20"
                  : "bg-beige"
              } ${selectedOptions[prompt.id] ? "p-[5%]" : ""}`}
            >
              {selectedOptions[prompt.id] ? (
                <Draggable
                  id={
                    options.find((o) => o.id === selectedOptions[prompt.id])?.id
                  }
                  optionRefs={optionRefs}
                  promptRefs={promptRefs}
                  draggedOver={draggedOver}
                  setDraggedOver={setDraggedOver}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  isEliminated={false}
                  match={prompt.id}
                >
                  <ChoiceButton
                    id={prompt.id}
                    className="[&>label]:!cursor-[inherit]"
                    style={{
                      backgroundColor: options.find(
                        (o) => o.id === selectedOptions[prompt.id]
                      )?.color,
                    }}
                    areDetailsShown={areDetailsShown}
                  >
                    <ChoiceButton.Icon>
                      <p className="text-[1em] font-light">{i + 1}&#46;</p>
                    </ChoiceButton.Icon>
                    <ChoiceButton.Content>
                      <MathJax className="!flex w-full items-center">
                        <MathJax className="text-[1em] tracking-tight font-medium">
                          {
                            options.find(
                              (o) => o.id === selectedOptions[prompt.id]
                            )?.content
                          }
                        </MathJax>
                      </MathJax>
                    </ChoiceButton.Content>
                  </ChoiceButton>
                </Draggable>
              ) : (
                <ChoiceButton
                  id={prompt.id}
                  className="!border-none"
                  style={{
                    backgroundColor: prompt.color,
                  }}
                  areDetailsShown={areDetailsShown}
                >
                  <ChoiceButton.Icon>
                    <p className="text-[1em] font-light">{i + 1}&#46;</p>
                  </ChoiceButton.Icon>
                  <ChoiceButton.Content>
                    <MathJax className="!flex w-full items-center">
                      <MathJax className="text-[1em] tracking-tight font-medium">
                        {prompt.content}
                      </MathJax>
                    </MathJax>
                  </ChoiceButton.Content>
                </ChoiceButton>
              )}
            </div>
          )
        )}
        {options.map((option, i) => (
          <div
            key={option.id}
            ref={optionRefs[i]}
            className={`relative w-full h-full bg-beige/50 rounded-lg lg:rounded-xl 2xl:rounded-[1vw] outline outline-1 outline-quill-gray -outline-offset-1 ${optionButtonGridFormat}`}
          >
            <Draggable
              id={option.id}
              optionRefs={optionRefs}
              promptRefs={promptRefs}
              draggedOver={draggedOver}
              setDraggedOver={setDraggedOver}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              isEliminated={option.eliminated}
            >
              <ChoiceButton
                id={option.id}
                className="[&>label]:!cursor-[inherit]"
                style={{ backgroundColor: option.color }}
                areDetailsShown={areDetailsShown}
              >
                <ChoiceButton.Icon>
                  <p className="text-[1em] font-light">
                    {String.fromCharCode(65 + i)}&#46;
                  </p>
                </ChoiceButton.Icon>
                <ChoiceButton.Content>
                  <MathJax className="!flex w-full items-center">
                    <MathJax className="text-[1em] tracking-tight font-medium">
                      {option.content}
                    </MathJax>
                  </MathJax>
                </ChoiceButton.Content>
              </ChoiceButton>
            </Draggable>
          </div>
        ))}
      </div>
    </div>
  );
}
