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
import { RiEdit2Fill } from "react-icons/ri";
import Layout from "@/common/layouts/Live";
import QuestionTypesEnum from "@/common/utils/question-types";
import Choice from "@/features/live/host/components/on-answering/Choice";
import TrueFalse from "@/features/live/host/components/on-answering/TrueFalse";
import FillBlank from "@/features/live/host/components/on-answering/FillBlank";
import Paragraph from "@/features/live/host/components/on-answering/Paragraph";
import Matching from "@/features/live/host/components/on-answering/Matching";
import wsStatuses from "@/features/live/utils/statuses";
import MediaTypes from "@/features/live/utils/media-types";
import NumberedTimer from "@/common/components/NumberedTimer";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import FilledButton from "@/common/components/buttons/FilledButton";
import OutlinedButton from "@/common/components/buttons/OutlinedButton";
import { http } from "@/common/services/axios";
import { useParams } from "react-router-dom";
import Pool from "@/features/live/host/components/on-answering/pool";

export default function OnAnswering() {
  const { code } = useParams();
  const mod = useTypedSelector((state) => state.mod);
  const [pending, setPending] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(
    mod.value.question!.timeLimit
  );
  const [isMediaShown, setMediaShown] = useState<boolean>(false);
  const [isSkipButtonShown, setSkipButtonShown] = useState<boolean>(false);
  const [curSubQ, setCurSubQ] = useState<number>(-1);
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
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.1), 1))();
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
      setTimeLeft(mod.value.timeLeft - 0.1);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <div {...handlers}>
      <Layout>
        <Layout.Content
          className={`relative text-dune flex flex-col font-sans-serif overflow-hidden ${
            mod.value.question!.fontSize === 0
              ? "text-2xs sm:text-xs 2xl:text-[0.6vw]"
              : mod.value.question!.fontSize === 1
              ? "text-xs sm:text-sm 2xl:text-[0.75vw]"
              : mod.value.question!.fontSize === 2
              ? "text-sm sm:text-base 2xl:text-[1vw]"
              : mod.value.question!.fontSize === 3
              ? "text-base sm:text-lg 2xl:text-[1.25vw]"
              : "text-2xl sm:text-2xl 2xl:text-[1.5vw]"
          } ${curSubQ >= 0 ? "bg-jordy-blue/75" : "bg-quartz"}`}
        >
          {mod.value.question!.type === QuestionTypesEnum.CHOICE && <Choice />}
          {mod.value.question!.type === QuestionTypesEnum.TRUE_FALSE && (
            <TrueFalse />
          )}
          {mod.value.question!.type === QuestionTypesEnum.FILL_BLANK && (
            <FillBlank />
          )}
          {mod.value.question!.type === QuestionTypesEnum.PARAGRAPH && (
            <Paragraph />
          )}
          {mod.value.question!.type === QuestionTypesEnum.MATCHING && (
            <Matching />
          )}
          {mod.value.question!.type === QuestionTypesEnum.POOL && (
            <Pool curSubQ={curSubQ} setCurSubQ={setCurSubQ} />
          )}
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
                  className="w-full max-h-full flex items-center justify-center bg-white rounded-t-[2em] border border-b-0 p-[3%] overflow-hidden"
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
          {pending && (
            <div className="!m-0 z-10 fixed top-0 left-0 h-screen w-screen bg-dune/50 flex justify-center items-center">
              <span className="animate-[spin_3s_linear_infinite] w-10 h-10 border-8 border-dotted rounded-full border-white" />
            </div>
          )}
        </Layout.Content>
        <Layout.Footer className="grid items-center grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-x-[3vw] sm:gap-x-[2%] px-[5%] 2xl:px-[2vw] gap-y-[10%] justify-items-center xs:justify-items-end">
          <div className="flex justify-end items-center h-full w-full">
            <ProgressBarTimer
              className="hidden sm:block [&>div]:bg-jordy-blue [&>div>span]:bg-denim"
              timeLeft={timeLeft}
              maxTime={mod.value.question!.timeLimit}
            />
            {isSkipButtonShown ? (
              <div className="flex sm:hidden flex-col justify-evenly h-full overflow-hidden">
                <FilledButton
                  type="button"
                  onClick={async () => {
                    setPending(true);
                    try {
                      await http.get(`live/${code}/interrupt`);
                    } catch (error) {
                      alert(error);
                    }
                  }}
                  className="text-body-1 md:text-header-2 2xl:text-[1vw] bg-denim !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] w-full transition-all duration-300"
                >
                  Skip
                </FilledButton>
                <OutlinedButton
                  type="button"
                  onClick={() => setSkipButtonShown(false)}
                  className="text-body-1 md:text-header-2 2xl:text-[1vw] !border-scarlet text-scarlet bg-beige/10 xs:border !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] w-full transition-all duration-300"
                >
                  Cancel
                </OutlinedButton>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSkipButtonShown(true)}
                className="block sm:hidden"
              >
                <NumberedTimer
                  className="!bg-jordy-blue !outline-denim"
                  timeLeft={timeLeft}
                />
              </button>
            )}
          </div>
          <FilledButton
            type="button"
            onClick={async () => {
              setPending(true);
              try {
                await http.get(`live/${code}/interrupt`);
              } catch (error) {
                alert(error);
              }
            }}
            className="hidden sm:block text-body-1 md:text-header-2 2xl:text-[1vw] bg-denim !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] w-full transition-all duration-300"
          >
            Skip
          </FilledButton>
          <div className="h-full flex flex-col items-center justify-evenly gap-[1vw] sm:gap-[0.4vw]">
            {mod.value.question!.type === QuestionTypesEnum.POOL ? (
              curSubQ >= 0 && (
                <>
                  <div className="flex justify-end items-center gap-[1vw] sm:gap-[0.25vw]">
                    {(mod.value.question!.subquestions[curSubQ].type ===
                      QuestionTypesEnum.CHOICE ||
                      mod.value.question!.subquestions[curSubQ].type ===
                        QuestionTypesEnum.TRUE_FALSE ||
                      mod.value.question!.subquestions[curSubQ].type ===
                        QuestionTypesEnum.MATCHING) && (
                      <PiHandTapFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
                    )}
                    {(mod.value.question!.subquestions[curSubQ].type ===
                      QuestionTypesEnum.FILL_BLANK ||
                      mod.value.question!.subquestions[curSubQ].type ===
                        QuestionTypesEnum.PARAGRAPH) && (
                      <RiEdit2Fill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
                    )}
                    <p className="text-[1em] xs:text-[1.15em] md:text-[1.5em] leading-none">
                      {mod.value.resCount}
                    </p>
                  </div>
                  <hr className="w-10" />
                </>
              )
            ) : (
              <>
                <div className="flex justify-end items-center gap-[1vw] sm:gap-[0.25vw]">
                  {(mod.value.question!.type === QuestionTypesEnum.CHOICE ||
                    mod.value.question!.type === QuestionTypesEnum.TRUE_FALSE ||
                    mod.value.question!.type ===
                      QuestionTypesEnum.MATCHING) && (
                    <PiHandTapFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
                  )}
                  {(mod.value.question!.type === QuestionTypesEnum.FILL_BLANK ||
                    mod.value.question!.type ===
                      QuestionTypesEnum.PARAGRAPH) && (
                    <RiEdit2Fill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
                  )}
                  <p className="text-[1em] xs:text-[1.15em] md:text-[1.5em] leading-none">
                    {mod.value.resCount}
                  </p>
                </div>
                <hr className="w-10" />
              </>
            )}
            <div className="flex justify-end items-center gap-[1vw] sm:gap-[0.25vw]">
              <PiPersonFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
              <p className="text-[1em] xs:text-[1.15em] md:text-[1.5em] leading-none">
                {mod.value.participantCount}
              </p>
            </div>
          </div>
        </Layout.Footer>
      </Layout>
    </div>
  );
}
