import Layout from "@/common/layouts/Live";
import logo from "@/common/assets/logo-alt.png";
import wsStatuses from "@/features/live/utils/statuses";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import NumberedTimer from "@/common/components/NumberedTimer";
import { PiPersonFill } from "react-icons/pi";

export default function OnQuestioning() {
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    if (timeLeft === 5 && mod.value.status === wsStatuses.QUESTIONING) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.5), 1))();
    }

    return () => {
      setTimeLeft(5);
    };
  }, []);

  useEffect(() => {
    console.log(mod.value.timeLeft, timeLeft);

    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.5);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <Layout>
      <Layout.Content className="relative text-dune bg-quartz grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
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
            <p className="absolute -left-1/4 2xl:-left-[0.75em] top-1/2 -translate-y-1/2 text-denim text-[3em] -rotate-[25deg]">
              ?
            </p>
            <p className="text-[1.5em]">Question:</p>
          </div>
          <MathJax className="text-[2.5em] leading-tight font-medium tracking-tight text-center self-start">
            {mod.value.question!.content}
          </MathJax>
        </div>
      </Layout.Content>
      <Layout.Footer className="grid grid-cols-[1fr_auto] items-center gap-x-[3vw] sm:gap-x-[2%] px-[5%] 2xl:px-[2vw] gap-y-[10%] justify-items-center">
        <div className="flex justify-end items-center h-full w-full">
          <ProgressBarTimer
            className="hidden sm:block [&>div]:bg-jordy-blue [&>div>span]:bg-denim"
            timeLeft={timeLeft}
            maxTime={5}
          />
          <NumberedTimer
            className="block sm:hidden !bg-jordy-blue !outline-denim"
            timeLeft={timeLeft}
          />
        </div>
        <div className="flex justify-end items-center gap-[1vw] sm:gap-[0.45vw]">
          <PiPersonFill className="w-[1.15em] h-[1.15em] xs:w-[1.25em] xs:h-[1.25em] sm:w-[1.75em] sm:h-[1.75em]" />
          <p className="text-[0.75em] xs:text-[1.15em] md:text-[1.5em] leading-none">
            {mod.value.participantCount}
          </p>
        </div>
      </Layout.Footer>
    </Layout>
  );
}
