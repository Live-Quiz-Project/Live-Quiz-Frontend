import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import logo from "@/common/assets/logo-alt.png";
import FilledButton from "@/common/components/buttons/FilledButton";
import Emoji from "@/common/utils/emojis";
import crown from "@/common/assets/crown.png";

export default function Podiums() {
  const participants = useTypedSelector((state) => state.participants);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 10);

    return () => setIsMounted(false);
  }, []);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start overflow-hidden">
      <div className="flex items-center justify-between w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
        <img
          src={logo}
          alt="logo"
          className="w-32 xs:w-44 md:w-52 2xl:w-[12vw]"
        />
        <FilledButton className="group inline-flex font-sans-serif bg-denim text-beige 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit">
          <span className="hidden xs:inline">Full&nbsp;</span>Leaderboard
          <FiArrowRight className="hidden sm:block m-auto group-hover:translate-x-2 transition-all duration-300" />
        </FilledButton>
      </div>
      <div className="-ml-[2vw] p-2 xs:p-4 md:p-6 lg:p-8 2xl:p-[2vw] !pb-0 w-full h-full flex justify-center items-end space-x-[1vw] sm:space-x-[1.5vw] 2xl:space-x-[2vw]">
        {participants.value[1] && (
          <div
            className={`relative w-[30%] 2xl:w-[25%] bg-koromiko rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw] transition-all duration-1000 ${
              isMounted ? "h-[45%] sm:h-[65%] p-[5%]" : "h-0"
            }`}
          >
            <div
              className={`absolute bottom-0 left-full w-96 border-t-transparent border-l-dune transition-all duration-700 h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] border-l-[5vw] ${
                isMounted ? "border-t-[10vw]" : ""
              }`}
            />
            <div
              className={`w-full overflow-hidden flex flex-col items-center space-y-[2vw] ${
                isMounted ? "h-full" : "h-0"
              }`}
            >
              <h1 className="text-header-1 sm:text-title 2xl:text-[2vw] font-sans-serif w-[10vw] h-[10vw] sm:w-[5vw] sm:h-[5vw] 2xl:w-[3vw] 2xl:h-[3vw] inline-flex items-center justify-center bg-egg-sour rounded-full">
                2
              </h1>
              <div className="max-w-full flex flex-col sm:flex-row justify-center items-center bg-dune p-2 rounded-t-full rounded-b-[150rem] sm:rounded-full font-sans-serif overflow-hidden">
                <span
                  className="rounded-full flex justify-center items-center min-w-12 h-12 xs:min-w-14 xs:h-14 sm:min-w-16 sm:h-16 lg:min-w-20 lg:h-20 2xl:min-w-[4.5vw] 2xl:h-[4.5vw] text-[1em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.75vw]"
                  style={{
                    backgroundColor: participants.value[1].displayColor,
                  }}
                >
                  {Emoji.find(
                    (e) => e.value === participants.value[1].displayEmoji
                  )?.label || Emoji[0].label}
                </span>
                <p className="w-full text-beige px-1 sm:px-3 lg:px-5 text-[1.25em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.5vw] truncate">
                  {participants.value[1].displayName}
                </p>
              </div>
              <p className="!m-2 font-sans-serif text-[1em] xs:text-[1.15em] md:text-[1.5em] 2xl:text-[1.25vw]">
                {participants.value[1].marks} Marks
              </p>
            </div>
          </div>
        )}
        {participants.value[0] && (
          <div
            className={`relative w-[40%] 2xl:w-[35%] bg-sienna rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw] transition-all duration-1000 ${
              isMounted ? "h-[50%] sm:h-[75%] p-[5%]" : "h-0"
            }`}
          >
            <img
              src={crown}
              alt="crown"
              className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-[20%] rotate-[3.5deg]"
            />
            <div
              className={`absolute bottom-0 left-full w-96 border-t-transparent border-l-dune transition-all duration-700 h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] border-l-[6vw] ${
                isMounted ? "border-t-[15vw]" : ""
              }`}
            />
            <div
              className={`w-full overflow-hidden flex flex-col items-center space-y-[2vw] ${
                isMounted ? "h-full" : "h-0"
              }`}
            >
              <h1 className="text-header-1 sm:text-title 2xl:text-[2vw] font-sans-serif w-[10vw] h-[10vw] sm:w-[5vw] sm:h-[5vw] 2xl:w-[3vw] 2xl:h-[3vw] inline-flex items-center justify-center bg-koromiko rounded-full">
                1
              </h1>
              <div className="max-w-full flex flex-col sm:flex-row justify-center items-center bg-dune p-2 rounded-t-full rounded-b-[150rem] sm:rounded-full font-sans-serif overflow-hidden">
                <span
                  className="rounded-full flex justify-center items-center min-w-12 h-12 xs:min-w-14 xs:h-14 sm:min-w-16 sm:h-16 lg:min-w-20 lg:h-20 2xl:min-w-[4.5vw] 2xl:h-[4.5vw] text-[1em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.75vw]"
                  style={{
                    backgroundColor: participants.value[0].displayColor,
                  }}
                >
                  {Emoji.find(
                    (e) => e.value === participants.value[0].displayEmoji
                  )?.label || Emoji[0].label}
                </span>
                <p className="w-full text-beige px-1 sm:px-3 lg:px-5 text-[1.25em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.5vw]">
                  {participants.value[0].displayName}
                </p>
              </div>
              <p className="!m-2 font-sans-serif text-[1em] xs:text-[1.15em] md:text-[1.5em] 2xl:text-[1.25vw]">
                {participants.value[0].marks} Marks
              </p>
            </div>
          </div>
        )}
        {participants.value[2] && (
          <div
            className={`relative w-[25%] 2xl:w-[20%] bg-karry rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw] transition-all duration-1000 ${
              isMounted ? "h-[42%] sm:h-[60%] p-[5%]" : "h-0"
            }`}
          >
            <div
              className={`absolute bottom-0 left-full w-96 border-t-transparent border-l-dune transition-all duration-700 h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] border-l-[4vw] ${
                isMounted ? "border-t-[10vw]" : ""
              }`}
            />
            <div
              className={`w-full overflow-hidden flex flex-col items-center space-y-[2vw] ${
                isMounted ? "h-full" : "h-0"
              }`}
            >
              <h1 className="text-header-1 sm:text-title 2xl:text-[2vw] font-sans-serif w-[10vw] h-[10vw] sm:w-[5vw] sm:h-[5vw] 2xl:w-[3vw] 2xl:h-[3vw] inline-flex items-center justify-center bg-koromiko rounded-full">
                3
              </h1>
              <div className="max-w-full flex flex-col sm:flex-row justify-center items-center bg-dune p-2 rounded-t-full rounded-b-[150rem] sm:rounded-full font-sans-serif overflow-hidden">
                <span
                  className="rounded-full flex justify-center items-center min-w-12 h-12 xs:min-w-14 xs:h-14 sm:min-w-16 sm:h-16 lg:min-w-20 lg:h-20 2xl:min-w-[4.5vw] 2xl:h-[4.5vw] text-[1em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.75vw]"
                  style={{
                    backgroundColor: participants.value[2].displayColor,
                  }}
                >
                  {Emoji.find(
                    (e) => e.value === participants.value[2].displayEmoji
                  )?.label || Emoji[0].label}
                </span>
                <p className="w-full text-beige px-1 sm:px-3 lg:px-5 text-[1.25em] xs:text-[1.5em] md:text-[1.75em] 2xl:text-[1.5vw]">
                  {participants.value[2].displayName}
                </p>
              </div>
              <p className="!m-2 font-sans-serif text-[1em] xs:text-[1.15em] md:text-[1.5em] 2xl:text-[1.25vw]">
                {participants.value[2].marks} Marks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
