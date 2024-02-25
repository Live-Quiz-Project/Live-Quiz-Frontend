import { useEffect, useRef, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useSwipeable } from "react-swipeable";
import {
  MdOutlineImage,
  MdOutlineVideoCameraBack,
  MdOutlineAudioFile,
} from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import { PiPersonFill, PiHandTapFill } from "react-icons/pi";
import Layout from "@/common/layouts/Live";
import QuestionTypesEnum from "@/common/utils/question-types";
import Choice from "@/features/live/host/components/on-answering/Choice";
import wsStatuses from "@/features/live/utils/statuses";
import MediaTypes from "@/features/live/utils/media-types";
import NumberedTimer from "@/common/components/NumberedTimer";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";

export default function OnAnswering() {
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(
    mod.value.question!.timeLimit
  );
  const [isMediaShown, setMediaShown] = useState<boolean>(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const handlers = useSwipeable({
    onSwipedUp: () => setMediaShown(true),
    onSwipedDown: () => setMediaShown(false),
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) {
        setMediaShown(false);
      }
    }

    if (
      timeLeft === mod.value.question!.timeLimit &&
      mod.value.status === wsStatuses.ANSWERING
    ) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.5), 1))();
    }

    if (mod.value.question!.mediaType !== "") {
      document.addEventListener("mousedown", onClickOutside);
    }

    return () => {
      setTimeLeft(mod.value.question!.timeLimit);
      if (mod.value.question!.mediaType !== "") {
        document.removeEventListener("mousedown", onClickOutside);
      }
    };
  }, []);

  useEffect(() => {
    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.5);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <div {...handlers}>
      <Layout>
        <Layout.Content
          className={`relative text-dune bg-quartz flex flex-col font-sans-serif overflow-hidden ${
            mod.value.question!.fontSize === 0
              ? "text-2xs sm:text-xs 2xl:text-[0.6vw]"
              : mod.value.question!.fontSize === 1
              ? "text-xs sm:text-sm 2xl:text-[0.75vw]"
              : mod.value.question!.fontSize === 2
              ? "text-sm sm:text-base 2xl:text-[1vw]"
              : mod.value.question!.fontSize === 3
              ? "text-base sm:text-lg 2xl:text-[1.25vw]"
              : "text-2xl sm:text-2xl 2xl:text-[1.5vw]"
          }`}
        >
          {mod.value.question!.type === QuestionTypesEnum.CHOICE && <Choice />}
          {mod.value.question!.mediaType !== "" && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[95vw] h-[calc(100dvh-4rem)] xs:h-[calc(100dvh-5rem)] md:h-[calc(100dvh-7rem)] z-50 2xl:h-[90dvh] transition-all duration-300 ${
                isMediaShown ? "top-0 pt-2.5" : "top-[calc(100%-1.99em)]"
              }`}
            >
              <div
                className={`grid grid-rows-[auto_1fr] justify-items-center h-full overflow-hidden ${
                  isMediaShown ? "-space-y-[1px]" : ""
                }`}
              >
                <button
                  onClick={() => setMediaShown((prev) => !prev)}
                  className="w-[4em] h-[2em] rounded-t-full bg-white border border-b-0 flex justify-center items-end z-50"
                >
                  {mod.value.question!.mediaType === MediaTypes.IMAGE && (
                    <MdOutlineImage size="1.5em" />
                  )}
                  {mod.value.question!.mediaType === MediaTypes.VIDEO && (
                    <MdOutlineVideoCameraBack size="1.5em" />
                  )}
                  {mod.value.question!.mediaType === MediaTypes.AUDIO && (
                    <MdOutlineAudioFile size="1.5em" />
                  )}
                  {mod.value.question!.mediaType === MediaTypes.EQUATION && (
                    <TbMathFunction size="1.5em" />
                  )}
                </button>
                <div
                  ref={mediaRef}
                  className="w-full max-h-full flex items-center justify-center bg-white rounded-t-[2em] border border-b-0 p-[3%]"
                >
                  <img
                    src={`${
                      import.meta.env.VITE_FIREBASE_STORAGE_BASE_URL
                    }/${encodeURIComponent(
                      mod.value.question!.media
                    )}?alt=media`}
                    alt={mod.value.question!.media}
                    className="object-contain h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}
        </Layout.Content>
        <Layout.Footer className="grid grid-cols-[1fr_auto_auto] items-center xs:grid-cols-[1fr_auto] gap-x-[3vw] sm:gap-x-[2%] px-[5%] 2xl:px-[2vw] gap-y-[10%] justify-items-center xs:justify-items-end">
          <div className="flex justify-end items-center h-full w-full">
            <ProgressBarTimer
              className="hidden sm:block [&>div]:bg-jordy-blue [&>div>span]:bg-denim"
              timeLeft={timeLeft}
              maxTime={mod.value.question!.timeLimit}
            />
            <NumberedTimer
              className="block sm:hidden !bg-jordy-blue !outline-denim"
              timeLeft={timeLeft}
            />
          </div>
          <div className="h-full grid grid-cols-1 xs:grid-cols-[1fr_auto_1fr] items-center gap-[1vw] sm:gap-[0.4vw] gap-y-[10%]">
            <div className="col-span-2 xs:col-span-1 col-start-2 xs:col-start-auto self-end xs:self-center flex justify-end items-center gap-[1vw] sm:gap-[0.2vw]">
              <PiHandTapFill className="w-[1.15em] h-[1.15em] xs:w-[1.5em] xs:h-[1.5em] sm:w-[2em] sm:h-[2em]" />
              <p className="text-[0.75em] xs:text-[1.15em] md:text-[1.5em] leading-none">
                {mod.value.resCount}
              </p>
            </div>
            <span className="hidden xs:inline text-[3em] -mr-[0.5vw] font-mono tracking-tighter">
              &#47;
            </span>
            <div className="col-span-2 xs:col-span-1 col-start-2 xs:col-start-auto self-start xs:self-center row-start-2 xs:row-start-auto flex justify-end items-center gap-[1vw] sm:gap-[0.25vw]">
              <PiPersonFill className="w-[1.15em] h-[1.15em] xs:w-[1.25em] xs:h-[1.25em] sm:w-[1.75em] sm:h-[1.75em]" />
              <p className="text-[0.75em] xs:text-[1.15em] md:text-[1.5em] leading-none">
                {mod.value.participantCount}
              </p>
            </div>
          </div>
        </Layout.Footer>
      </Layout>
    </div>
  );
}
