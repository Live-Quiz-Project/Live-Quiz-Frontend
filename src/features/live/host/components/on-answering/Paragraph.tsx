import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import logo from "@/common/assets/logo-alt.png";
import { BiChevronLeft, BiSwim } from "react-icons/bi";

type Props = {
  q?: Question;
  setCurSubQ?: Dispatch<SetStateAction<number>>;
};

export default function Paragraph({ q, setCurSubQ }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }
  }, [q]);

  return (
    <div
      className={`flex-1 grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-hidden ${
        q
          ? isNoteExpanded
            ? "grid-rows-2"
            : "grid-rows-[auto_auto_1fr]"
          : isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      {q && !isNoteExpanded && (
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
        className={`relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] grid-rows-[1fr_auto] grid-cols-[1fr_auto] ${
          q ? (isNoteExpanded ? "!pb-0" : "!py-0") : "!pb-0"
        }`}
      >
        {!isNoteExpanded && (
          <img
            src={logo}
            alt="logo"
            className="w-44 xs:w-52 2xl:w-[12vw] my-auto"
          />
        )}
        <button
          type="button"
          onClick={() => {
            setNoteExpanded((prev) => !prev);
            setNoteFirstOpened(false);
          }}
          className={`group grid gap-[1em] font-serif min-h-[3em] max-h-full ${
            isNoteExpanded
              ? "grid-cols-[1fr_auto] col-span-2 h-full bg-white items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
              : "grid-cols-1 items-center place-self-end"
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
      </div>
      <div className="flex justify-center items-center gap-2 sm:gap-4 2xl:gap-[1vw] w-full h-full overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 text-[2em] font-serif">
        <div className="group relative grid grid-cols-[auto_1fr] gap-[0.75em] font-serif min-h-[3em] max-h-full items-center">
          <div className="flex items-center h-[3em] font-serif">
            <p className="translate-x-1/4 text-[2em] !-rotate-[25deg] text-denim">
              ?
            </p>
          </div>
          <MathJax className="z-1 tracking-tight font-medium text-center text-[1.5em] w-fit leading-normal">
            {question!.content}
          </MathJax>
        </div>
      </div>
    </div>
  );
}
