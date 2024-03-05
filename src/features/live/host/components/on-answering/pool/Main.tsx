import { BiSwim } from "react-icons/bi";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { MathJax } from "better-react-mathjax";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import ModeToggler from "@/features/live/host/components/on-answering/pool/ModeToggler";
import QuestionTypesEnum from "@/common/utils/question-types";
import BLANK_IDENTIFIER from "@/features/live/utils/blank-identifier";
import QuestionLabels from "@/common/utils/question-labels";

type Props = {
  setCurSubQ: Dispatch<SetStateAction<number>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function Main({ onSubmit, setCurSubQ }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<number>(0);
  const modesSM = ["Q", "SubQ"];
  const modesLG = ["Question", "Subquestions"];

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] w-full h-full"
    >
      <div
        className={`bg-jordy-blue rounded-2xl xs:rounded-3xl w-full h-full grid gap-[1em] p-3 md:p-4 lg:p-6 2xl:p-[2vw] ${
          isNoteExpanded ? "grid-rows-2" : "grid-rows-[auto_1fr]"
        }`}
      >
        <div
          className={`relative grid gap-x-[1em] h-full grid-rows-[1fr_auto] grid-cols-[1fr_auto_1fr] ${
            isNoteExpanded ? "items-start" : "items-center"
          }`}
        >
          {!isNoteExpanded && <BiSwim className="text-denim size-[2.25em]" />}
          {!isNoteExpanded && (
            <>
              <ModeToggler
                className="flex sm:hidden text-[1em]"
                modes={modesSM}
                mode={mode}
                setMode={setMode}
              />
              <ModeToggler
                className="hidden sm:flex text-[1.25em]"
                modes={modesLG}
                mode={mode}
                setMode={setMode}
              />
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setNoteExpanded((prev) => !prev);
              setNoteFirstOpened(false);
            }}
            className={`group grid gap-[1em] font-serif h-fit ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] row-start-1 col-span-3 h-full bg-white items-start outline outline-1 rounded-2xl xs:rounded-3xl z-1 overflow-auto -m-[1em] xs:-m-[1.25em] py-[1.2em] px-[1em] xs:py-[1.5em] xs:px-[1.25em]"
                : "grid-cols-1 items-center w-fit place-self-end"
            }`}
          >
            {isNoteExpanded && (
              <MathJax
                className={`h-full tracking-tight font-serif font-medium text-left text-[1.75em] w-full ${
                  isNoteExpanded
                    ? "pt-[0.1em] leading-normal"
                    : "truncate leading-[1.75]"
                }`}
              >
                {mod.value.question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-fit text-denim flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              ) : (
                <AiOutlineMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              )}
              {mod.value.question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 -top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        </div>
        {mode === 0 && (
          <div className="w-full h-full grid items-center text-center overflow-auto">
            <MathJax className="tracking-tight font-medium text-[1.75em] leading-normal font-serif">
              {mod.value.question!.content}
            </MathJax>
          </div>
        )}
        {mode === 1 && (
          <div className="grid grid-rows-6 sm:grid-rows-1 grid-flow-col sm:grid-flow-row grid-cols-6 auto-cols-fr auto-rows-fr overflow-auto gap-[0.5em] md:gap-[1vw] text-[1.25em] leading-normal">
            {mod.value.question!.subquestions.map((subquestion, i) => (
              <button
                key={subquestion.id}
                value={i}
                onClick={(e) => setCurSubQ(+e.currentTarget.value)}
                className={`relative bg-beige border px-[10%] py-[7%] flex justify-between flex-col items-end text-left rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-2xl w-full h-full ${
                  mod.value.question!.subquestions.length === 1
                    ? "row-span-6 sm:row-span-1 col-span-6"
                    : mod.value.question!.subquestions.length === 2
                    ? "row-span-3 sm:row-span-1 col-span-6 sm:col-span-3"
                    : mod.value.question!.subquestions.length === 3
                    ? "row-span-2 sm:row-span-1 col-span-6 sm:col-span-2"
                    : mod.value.question!.subquestions.length === 4
                    ? "row-span-3 sm:row-span-1 col-span-3 sm:col-span-3"
                    : mod.value.question!.subquestions.length === 5
                    ? "row-span-2 [&:nth-child(3)]:col-span-6 sm:row-span-1 col-span-3 sm:col-span-2 sm:[&:nth-child(4)]:col-start-2 sm:[&:nth-child(3)]:col-span-2"
                    : "row-span-2 sm:row-span-1 col-span-3 sm:col-span-2"
                }`}
              >
                <div className="w-full">
                  <p className="text-regent-gray text-[1em]">
                    {
                      QuestionLabels[
                        subquestion.type as keyof typeof QuestionLabels
                      ]
                    }
                  </p>
                  {subquestion.type !== QuestionTypesEnum.FILL_BLANK ? (
                    <p className="truncate text-[1.5em] font-medium leading-loose font-serif">
                      {subquestion.content}
                    </p>
                  ) : (
                    <p className="truncate text-[1.5em] font-medium leading-loose">
                      {subquestion.content
                        .split(BLANK_IDENTIFIER)
                        .map((item, index) => (
                          <span key={index}>
                            {item}
                            {index <
                              (subquestion.options as TextOption[]).length && (
                              <span className="text-denim mx-1">
                                &#40;{String.fromCharCode(65 + index)}&#41;
                              </span>
                            )}
                          </span>
                        ))}
                    </p>
                  )}
                </div>
                <div className="text-regent-gray">
                  {(subquestion.type === QuestionTypesEnum.CHOICE ||
                    subquestion.type === QuestionTypesEnum.TRUE_FALSE) && (
                    <p className="text-[1em]">
                      {(subquestion.options as ChoiceOption[]).length}
                      &nbsp;Choices
                    </p>
                  )}
                  {subquestion.type === QuestionTypesEnum.FILL_BLANK && (
                    <p className="text-[1em]">
                      {(subquestion.options as TextOption[]).length}&nbsp;Blanks
                    </p>
                  )}
                  {subquestion.type === QuestionTypesEnum.PARAGRAPH &&
                    (subquestion.options as TextOption[]).length > 0 &&
                    (subquestion.options as TextOption[])[0].caseSensitive && (
                      <p className="text-[1em]">Case Sensitive</p>
                    )}
                  {subquestion.type === QuestionTypesEnum.MATCHING && (
                    <>
                      <p className="text-[1em]">
                        {(subquestion.options as MatchingOption).prompts.length}
                        &nbsp;Prompts
                      </p>
                      <p className="text-[1em]">
                        {(subquestion.options as MatchingOption).options.length}
                        &nbsp;Options
                      </p>
                    </>
                  )}
                  {(subquestion as any).pool_required && <em>Required</em>}
                </div>
                {/* <div className="absolute bottom-0 left-0 px-[10%] py-[7%]">
                  <img
                    src=""
                    alt=""
                    className="w-[8vw] h-[8vw] sm:w-[4vw] sm:h-[4vw] object-contain"
                  />
                </div> */}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
