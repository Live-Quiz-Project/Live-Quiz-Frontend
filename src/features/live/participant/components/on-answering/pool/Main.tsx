import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { MathJax } from "better-react-mathjax";
import { useState } from "react";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { BiSwim } from "react-icons/bi";
import { HiOutlineArrowLongDown } from "react-icons/hi2";

export default function Main() {
  const mod = useTypedSelector((state) => state.mod);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);

  return (
    <div className="relative p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] w-full h-full">
      <div
        className={`bg-koromiko/40 rounded-2xl xs:rounded-3xl flex-1 w-full h-full grid gap-2 sm:gap-4 2xl:gap-[1vw] p-3 md:p-4 lg:p-6 2xl:p-[2vw] ${
          isNoteExpanded ? "grid-rows-2" : "grid-rows-[auto_1fr]"
        }`}
      >
        <div className="relative grid items-start gap-x-[1em] h-full grid-rows-[1fr_auto] grid-cols-[1fr_auto]">
          {!isNoteExpanded && <BiSwim className="text-sienna size-[2.25em]" />}
          <button
            type="button"
            onClick={() => {
              setNoteExpanded((prev) => !prev);
              setNoteFirstOpened(false);
            }}
            className={`group grid gap-[1em] font-serif max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-2 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "grid-cols-1 items-center"
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
            <div className="relative w-[2em] h-[2em] text-sienna flex items-center">
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
        <div className="w-full h-full grid items-center text-center overflow-auto">
          <MathJax className="tracking-tight font-medium text-[1.75em] leading-normal font-serif">
            {mod.value.question!.content}
          </MathJax>
        </div>
      </div>
      <div className="absolute bottom-1 right-[5%] 2xl:right-[2vw] text-sienna animate-bounce">
        <p className="absolute bottom-full right-1/2 w-max text-[1.15em]">
          Continue here
        </p>
        <HiOutlineArrowLongDown className="rotate-[-25deg] w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw]" />
      </div>
    </div>
  );
}
