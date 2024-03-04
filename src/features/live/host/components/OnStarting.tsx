import Layout from "@/common/layouts/Live";
import logo from "@/common/assets/logo-alt.png";
import wsStatuses from "@/features/live/utils/statuses";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useState } from "react";
import { PiPersonFill } from "react-icons/pi";

export default function OnStarting() {
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(3);

  useEffect(() => {
    if (timeLeft === 3 && mod.value.status === wsStatuses.STARTING) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.1), 1))();
    }

    return () => {
      setTimeLeft(3);
    };
  }, []);

  useEffect(() => {
    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.1);
    }
  }, [mod.value.timeLeft]);

  return (
    <Layout>
      <Layout.Content className="relative text-dune bg-quartz grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
        <img src={logo} alt="logo" className="w-44 xs:w-52 2xl:w-[12vw]" />
        <div className="w-full grid grid-rows-[auto_auto] items-center justify-items-center space-y-4 font-serif text-header-3 2xl:text-[1.25vw] text-center overflow-auto">
          <div className="self-end">
            <p className="text-[2em] font-semibold leading-tight">
              {mod.value.quizTitle}
            </p>
          </div>
          <div className="space-y-2 self-start">
            <p className="leading-none">Going live in...</p>
            <p className="font-sans-serif leading-none">
              {Math.ceil(timeLeft + 0.1)}
            </p>
          </div>
        </div>
      </Layout.Content>
      <Layout.Footer className="flex justify-end items-center gap-[1vw] sm:gap-[0.45vw] px-[5%] 2xl:px-[2vw]">
        <PiPersonFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
        <p className="text-[1em] xs:text-[1.15em] md:text-[1.5em] leading-none">
          {mod.value.participantCount}
        </p>
      </Layout.Footer>
    </Layout>
  );
}
