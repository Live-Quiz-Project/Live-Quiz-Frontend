import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import Answers from "@/features/live/host/components/on-revealing-answer/choice/Answers";
import Correct from "@/features/live/host/components/on-revealing-answer/choice/Correct";
import ModeToggler from "@/features/live/host/components/on-revealing-answer/ModeToggler";

type Props = {
  className?: string;
  q?: Question;
  a?: ChoiceOption[];
};

export default function TrueFalse({ className, q, a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [mode, setMode] = useState<number>(0);

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }
  }, [q]);

  return (
    <div
      className={`bg-quartz grid grid-rows-[auto_1fr] gap-[1em] justify-items-center items-center w-full h-full overflow-auto ${className}`}
    >
      <div className="grid grid-cols-[1fr_auto] gap-[1em] items-center w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 overflow-auto">
        <div className="grid grid-cols-[auto_1fr] gap-[1em] xs:gap-[1.5em] items-center font-serif overflow-auto">
          <div className="flex items-center h-[3em] truncate w-[115%]">
            <p className="text-[2.25em] !-rotate-[25deg] text-denim">A</p>
          </div>
          <MathJax className="tracking-tight font-medium text-left text-[1.75em] truncate leading-[1.75]">
            {question!.content}
          </MathJax>
        </div>
        <ModeToggler
          className="text-jordy-blue"
          setMode={setMode}
          mode={mode}
        />
      </div>
      {mode === 0 && <Answers a={a ? a : mod.value.answers} />}
      {mode === 1 && (
        <Correct
          a={
            a
              ? a.filter((a) => a.correct)
              : (mod.value.answers as ChoiceOption[]).filter((an) => an.correct)
          }
        />
      )}
    </div>
  );
}
