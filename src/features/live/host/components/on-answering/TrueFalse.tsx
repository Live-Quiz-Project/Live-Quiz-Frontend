import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import { FaXmark, FaCheck, FaQuestion } from "react-icons/fa6";
import ChoiceButton from "@/features/live/components/ChoiceButton";
import { BiChevronLeft, BiSwim } from "react-icons/bi";

type Props = {
  q?: Question;
  setCurSubQ?: Dispatch<SetStateAction<number>>;
};

export default function TrueFalse({ q, setCurSubQ }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const optionsContainerGridFormat =
    question!.layout === 0
      ? `${
          (question!.options as ChoiceOption[]).length === 3
            ? "grid-rows-3"
            : (question!.options as ChoiceOption[]).length === 4
            ? "grid-rows-4"
            : "grid-rows-10"
        } grid-flow-col auto-cols-fr ${
          (question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:row-start-5"
            : (question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:row-start-4"
            : (question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:row-start-3"
            : (question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:row-start-2"
            : null
        }`
      : `${
          (question!.options as ChoiceOption[]).length === 3
            ? "grid-cols-3"
            : (question!.options as ChoiceOption[]).length === 4
            ? "grid-cols-4"
            : "grid-cols-10"
        } auto-rows-fr ${
          (question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:col-start-5"
            : (question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:col-start-4"
            : (question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:col-start-3"
            : (question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:col-start-2"
            : null
        }`;
  const choiceButtonGridFormat =
    question!.layout === 0
      ? `${
          (question!.options as ChoiceOption[]).length === 1
            ? "row-span-10 !row-start-1"
            : (question!.options as ChoiceOption[]).length === 2
            ? "row-span-5 first:!row-start-1"
            : (question!.options as ChoiceOption[]).length === 3
            ? "row-span-1 first:!row-start-1"
            : (question!.options as ChoiceOption[]).length === 4
            ? "row-span-1 first:!row-start-1"
            : "row-span-2"
        }`
      : (question!.options as ChoiceOption[]).length === 1
      ? "col-span-10 !col-start-1"
      : (question!.options as ChoiceOption[]).length === 2
      ? "col-span-5 first:!col-start-1"
      : (question!.options as ChoiceOption[]).length === 3
      ? "col-span-1 first:!col-start-1"
      : (question!.options as ChoiceOption[]).length === 4
      ? "col-span-1 first:!col-start-1"
      : "col-span-2";

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }
  }, [q]);

  return (
    <div
      className={`flex-1 grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        q
          ? isQuestionExpanded || isNoteExpanded
            ? "grid-rows-2"
            : "grid-rows-[auto_auto_1fr]"
          : isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      {q && !isNoteExpanded && !isQuestionExpanded && (
        <div className="p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 text-denim">
          <button
            onClick={() => setCurSubQ && setCurSubQ(-1)}
            className="flex bg-beige rounded-full px-2 py-1 xs:px-3 xs:py-1.5 items-center justify-center"
          >
            <BiChevronLeft className="-ml-[20%] size-[1.5em]" />
            <BiSwim className="size-[1.5em]" />
          </button>
        </div>
      )}
      <div
        className={`relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] grid-rows-[1fr_auto] ${
          q
            ? isQuestionExpanded || isNoteExpanded
              ? "grid-cols-[1fr_0fr] !pb-0"
              : "grid-cols-[1fr_auto] !py-0"
            : isQuestionExpanded
            ? "grid-cols-[1fr_0fr] !pb-0"
            : "grid-cols-[1fr_auto] !pb-0"
        }`}
      >
        {!isNoteExpanded && (
          <button
            type="button"
            onClick={() => setQuestionExpanded((prev) => !prev)}
            className={`group relative grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[3em] max-h-full ${
              isQuestionExpanded
                ? "col-span-2 h-full bg-white items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            }`}
          >
            <span className="opacity-0 group-hover:opacity-100 absolute w-full h-full bg-white rounded-full blur-lg transition-all duration-300" />
            <div className="flex items-center h-[3em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-denim">
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
              {question!.content}
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
            className={`group grid gap-[1em] font-serif min-h-[3em] max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-2 h-full bg-white items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
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
                {question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-[3em] text-denim flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              ) : (
                <AiOutlineMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              )}
              {question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        )}
      </div>
      <div
        className={`w-full h-full overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 grid justify-items-center gap-2 sm:gap-4 2xl:gap-[1vw] tracking-tight ${optionsContainerGridFormat}`}
      >
        {(question!.options as ChoiceOption[]).map((option, i) => (
          <ChoiceButton
            key={option.id}
            className={`text-[1.25em] xs:text-[1.5em] p-2 sm:p-4 2xl:p-[0.6em] ${choiceButtonGridFormat}`}
            style={{ backgroundColor: option.color }}
            areDetailsShown={i >= 2}
            disabled
          >
            <ChoiceButton.Icon>
              {i === 0 && <FaCheck className="size-[1em]" />}
              {i === 1 && <FaXmark className="size-[1em]" />}
              {i === 2 && <FaQuestion className="size-[1em]" />}
            </ChoiceButton.Icon>
            <ChoiceButton.Content>
              <MathJax className="text-[1em] tracking-tight font-medium">
                {option.content}
              </MathJax>
            </ChoiceButton.Content>
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
