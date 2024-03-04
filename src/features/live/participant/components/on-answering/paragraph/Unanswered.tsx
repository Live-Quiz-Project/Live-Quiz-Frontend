import BaseTextarea from "@/common/components/textareas/BaseTextarea";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";

type Props = {
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
};

export default function Unanswered({ answer, setAnswer }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);

  function onChange(e: FormEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setAnswer(e.currentTarget.value);
  }

  return (
    <div
      className={`flex-1 w-full h-full grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      <div
        className={`relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 grid-rows-[1fr_auto] ${
          (mod.value.question!.options as ChoiceOption[]).length > 2
            ? isQuestionExpanded
              ? "grid-cols-[1fr_0fr_0fr]"
              : "grid-cols-[1fr_0fr_auto]"
            : isQuestionExpanded
            ? "grid-cols-[1fr_0fr]"
            : "grid-cols-[1fr_auto]"
        }`}
      >
        {!isNoteExpanded && (
          <button
            type="button"
            onClick={() => setQuestionExpanded((prev) => !prev)}
            className={`group relative grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[3em] max-h-full ${
              isQuestionExpanded
                ? "h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            } ${
              (mod.value.question!.options as ChoiceOption[]).length > 2
                ? isQuestionExpanded
                  ? "col-span-3"
                  : ""
                : isQuestionExpanded
                ? "col-span-2"
                : ""
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
            } ${
              (mod.value.question!.options as ChoiceOption[]).length > 2
                ? isNoteExpanded
                  ? "col-span-3"
                  : ""
                : isNoteExpanded
                ? "col-span-2"
                : ""
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
      </div>
      <div className="w-full h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 text-[1.5em] items-center tracking-tight leading-[1.75]">
        <BaseTextarea
          className="text-[1em] border bg-beige p-2 sm:p-4 2xl:p-[0.6em] w-full h-full rounded-lg xs:rounded-xl 2xl:rounded-[1vw]"
          placeholder="Enter answer..."
          value={answer}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
