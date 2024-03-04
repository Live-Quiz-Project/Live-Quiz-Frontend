import EditableLabel from "@/common/components/inputs/EditableLabel";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";

type Props = {
  answeredOptions: TextOption[];
  setAnsweredOptions: Dispatch<SetStateAction<TextOption[]>>;
};

export default function Unanswered({
  answeredOptions,
  setAnsweredOptions,
}: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);

  function onChange(e: ChangeEvent<HTMLSpanElement>) {
    e.preventDefault();
    const id = e.currentTarget.id;
    const content = e.currentTarget.innerText;
    setAnsweredOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, content: content } : option
      )
    );
  }

  return (
    <div
      className={`flex-1 w-full h-full grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        isNoteExpanded ? "grid-rows-2" : "grid-rows-[auto_1fr]"
      }`}
    >
      <div className="relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 grid-rows-[1fr_auto] grid-cols-[1fr_auto]">
        {!isNoteExpanded && (
          <div className="group relative grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[3em] max-h-full items-center">
            <div className="flex items-center h-[3em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-denim">
                ?
              </p>
            </div>
            <MathJax className="z-1 h-full tracking-tight font-medium text-left text-[1.75em] w-full truncate leading-[1.75]">
              Fill in the blanks
            </MathJax>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setNoteExpanded((prev) => !prev);
            setNoteFirstOpened(false);
          }}
          className={`group grid gap-[1em] font-serif min-h-[3em] max-h-full ${
            isNoteExpanded
              ? "grid-cols-[1fr_auto] col-span-2 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
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
          <div className="relative w-[2em] h-[3em] text-denim flex items-center">
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
      </div>
      <div
        className="w-full h-full grid items-center content-center gap-4 sm:gap-6 2xl:gap-[1vw] p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 overflow-auto"
        style={{
          gridTemplateRows: `repeat(${
            (mod.value.question!.options as TextOption[]).length
          }, auto)`,
        }}
      >
        {(mod.value.question!.options as TextOption[]).map((option, i) => (
          <div
            key={option.id}
            className="w-full flex gap-4 sm:gap-6 2xl:gap-[1vw] text-[1.5em] items-center tracking-tight leading-[1.75]"
          >
            <span
              className={`inline-flex items-center justify-center min-w-[2em] min-h-[2em] rounded-full bg-beige border font-sans-serif ring-sienna ${
                option.caseSensitive ? "ring-4" : ""
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <EditableLabel
              className="text-[1em] border bg-beige p-2 sm:p-4 2xl:p-[0.6em] w-full rounded-lg xs:rounded-xl 2xl:rounded-[1vw] break-all"
              placeholder={`Enter answer for blank ${String.fromCharCode(
                65 + i
              )}...`}
              id={option.id}
              value={
                answeredOptions.find((a) => a.id === option.id)?.content || ""
              }
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
