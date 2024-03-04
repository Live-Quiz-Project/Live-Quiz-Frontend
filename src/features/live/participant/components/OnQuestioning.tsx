import Layout from "@/common/layouts/Live";
import logo from "@/common/assets/logo-dark.png";
import wsStatuses from "@/features/live/utils/statuses";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import NumberedTimer from "@/common/components/NumberedTimer";
import QuestionTypesEnum from "@/common/utils/question-types";

export default function OnQuestioning() {
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    if (timeLeft === 5 && mod.value.status === wsStatuses.QUESTIONING) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.1), 1))();
    }

    return () => {
      setTimeLeft(5);
    };
  }, []);

  useEffect(() => {
    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.1);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <Layout>
      <Layout.Content className="relative text-dune bg-egg-sour grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
        <img src={logo} alt="logo" className="w-44 xs:w-52 2xl:w-[12vw]" />
        <div
          className={`w-full grid grid-rows-[auto_auto] items-center justify-items-center font-serif overflow-auto ${
            mod.value.question!.fontSize === 0
              ? "text-xs sm:text-sm 2xl:text-[0.6vw]"
              : mod.value.question!.fontSize === 1
              ? "text-sm sm:text-base 2xl:text-[0.75vw]"
              : mod.value.question!.fontSize === 2
              ? "text-base sm:text-lg 2xl:text-[1vw]"
              : mod.value.question!.fontSize === 3
              ? "text-lg sm:text-xl 2xl:text-[1.25vw]"
              : "text-xl sm:text-2xl 2xl:text-[1.5vw]"
          }`}
        >
          <div className="relative flex items-center justify-center w-fit h-12 2xl:h-[4em] self-end">
            <p className="absolute -left-1/4 2xl:-left-[0.75em] top-1/2 -translate-y-1/2 text-sienna text-[3em] -rotate-[25deg]">
              ?
            </p>
            <p className="text-[1.5em]">Question:</p>
          </div>
          <MathJax className="text-[2.5em] leading-tight font-medium tracking-tight text-center self-start">
            {mod.value.question!.type === QuestionTypesEnum.FILL_BLANK
              ? "Fill in the blanks"
              : mod.value.question!.content}
          </MathJax>
        </div>
      </Layout.Content>
      <Layout.Footer className="px-[5%] 2xl:px-[2vw]">
        {mod.value.status === wsStatuses.QUESTIONING ? (
          <div className="flex justify-end items-center h-full w-full">
            <ProgressBarTimer
              className="hidden sm:block"
              timeLeft={timeLeft}
              maxTime={5}
            />
            <NumberedTimer className="block sm:hidden" timeLeft={timeLeft} />
          </div>
        ) : (
          <div className="text-body-2 text-right xs:text-[1em] leading-tight h-full flex flex-col justify-center items-end">
            <p>Look at the host screen!</p>
            <p>Showing media...</p>
          </div>
        )}
      </Layout.Footer>
    </Layout>
  );
}
