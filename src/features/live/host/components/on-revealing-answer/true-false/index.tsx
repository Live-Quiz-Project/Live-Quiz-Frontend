import { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import Answers from "@/features/live/host/components/on-revealing-answer/true-false/Answers";
import Correct from "@/features/live/host/components/on-revealing-answer/true-false/Correct";
import ModeToggler from "@/features/live/host/components/on-revealing-answer/ModeToggler";

export default function TrueFalse() {
  const mod = useTypedSelector((state) => state.mod);
  const [mode, setMode] = useState<number>(0);

  return (
    <div className="bg-quartz grid grid-rows-[auto_1fr] gap-[1em] justify-items-center items-center w-full h-full overflow-auto">
      <div className="grid grid-cols-[1fr_auto] gap-[1em] items-center w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 overflow-auto">
        <div className="grid grid-cols-[auto_1fr] gap-[1em] xs:gap-[1.5em] items-center font-serif overflow-auto">
          <div className="flex items-center h-[3em] truncate w-[115%]">
            <p className="text-[2.25em] !-rotate-[25deg] text-denim">A</p>
          </div>
          <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
            {mod.value.question!.content}
          </MathJax>
        </div>
        <ModeToggler setMode={setMode} mode={mode} />
      </div>
      {mode === 0 && <Answers />}
      {mode === 1 && <Correct />}
    </div>
  );
}
