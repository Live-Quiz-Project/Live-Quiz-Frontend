import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useRef, useState } from "react";
import {
  MdOutlineAudioFile,
  MdOutlineImage,
  MdOutlineVideoCameraBack,
} from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import Layout from "@/common/layouts/Live";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import NumberedTimer from "@/common/components/NumberedTimer";
import { useSwipeable } from "react-swipeable";
import MediaTypes from "@/features/live/utils/media-types";
import FilledButton from "@/common/components/buttons/FilledButton";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Main from "@/features/live/participant/components/on-answering/pool/Main";
import QuestionTypesEnum from "@/common/utils/question-types";
import TrueFalse from "@/features/live/participant/components/on-answering/pool/TrueFalse";
import FillBlank from "@/features/live/participant/components/on-answering/pool/FillBlank";
import Paragraph from "@/features/live/participant/components/on-answering/pool/Paragraph";

type Props = {
  timeLeft: number;
};

export default function Pool({ timeLeft }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [curSubQ, setCurSubQ] = useState<number>(-1);
  const [isMediaShown, setMediaShown] = useState<boolean>(false);
  const [isRequired, setRequired] = useState<boolean>(false);
  const handlers = useSwipeable({
    onSwipedUp: () => setMediaShown(true),
    onSwipedDown: () => setMediaShown(false),
  });
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(mod.value.answers?.answers);
  }, [mod.value.answers]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) {
        setMediaShown(false);
      }
    }

    if (mod.value.question!.mediaType !== "") {
      document.addEventListener("mousedown", onClickOutside);
    }

    return () => {
      if (mod.value.question!.mediaType !== "") {
        document.removeEventListener("mousedown", onClickOutside);
      }
    };
  }, []);

  useEffect(() => {
    if (curSubQ > -1) setRequired(false);
  }, [curSubQ]);

  return (
    <div {...handlers}>
      <Layout>
        <Layout.Content
          className={`relative text-dune bg-egg-sour flex flex-col font-sans-serif overflow-hidden ${
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
          {curSubQ < 0 && <Main />}
          {curSubQ >= 0 && (
            <>
              {mod.value.question!.subquestions[curSubQ].type ===
                QuestionTypesEnum.TRUE_FALSE && (
                <TrueFalse
                  timeLeft={timeLeft}
                  curSubQ={curSubQ}
                  setCurSubQ={setCurSubQ}
                  setMediaShown={setMediaShown}
                  required={isRequired}
                />
              )}
              {mod.value.question!.subquestions[curSubQ].type ===
                QuestionTypesEnum.FILL_BLANK && (
                <FillBlank
                  timeLeft={timeLeft}
                  curSubQ={curSubQ}
                  setCurSubQ={setCurSubQ}
                  setMediaShown={setMediaShown}
                  required={isRequired}
                />
              )}
              {mod.value.question!.subquestions[curSubQ].type ===
                QuestionTypesEnum.PARAGRAPH && (
                <Paragraph
                  timeLeft={timeLeft}
                  curSubQ={curSubQ}
                  setCurSubQ={setCurSubQ}
                  setMediaShown={setMediaShown}
                  required={isRequired}
                />
              )}
            </>
          )}
          {mod.value.question!.mediaType !== "" &&
            (!mod.value.answers ||
              (mod.value.answers.answers[curSubQ] &&
                mod.value.answers.answers[curSubQ].length) <= 0) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-[95vw] h-[calc(100dvh-4rem)] xs:h-[calc(100dvh-5rem)] md:h-[calc(100dvh-7rem)] z-40 2xl:h-[90dvh] transition-all duration-300 ${
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
                    className="w-[4em] h-[2em] rounded-t-full bg-beige border border-b-0 flex justify-center items-end z-40"
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
                    className="w-full max-h-full flex items-center justify-center bg-beige rounded-t-[2em] border border-b-0 p-[3%] overflow-hidden"
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
        <Layout.Footer className="grid grid-cols-[1fr_auto] gap-x-[3vw] sm:gap-x-[2%] items-center px-[5%] 2xl:px-[2vw]">
          <div className="flex justify-end items-center h-full w-full">
            <ProgressBarTimer
              className="hidden sm:block"
              timeLeft={timeLeft}
              maxTime={mod.value.question!.timeLimit}
            />
            <NumberedTimer className="block sm:hidden" timeLeft={timeLeft} />
          </div>
          {
            <div className="divide-x border divide-koromiko border-koromiko rounded-full h-fit">
              <FilledButton
                className="!bg-sienna rounded-r-none !py-1 !px-0.5 xs:!p-2 h-full disabled:text-beige/30"
                onClick={() => setCurSubQ((prev) => prev - 1)}
                disabled={curSubQ < 0}
              >
                <BiChevronLeft className="w-4 h-4" />
              </FilledButton>
              <FilledButton
                className="!bg-sienna rounded-l-none !py-1 !px-0.5 xs:!p-2 h-full disabled:text-beige/30"
                onClick={() => {
                  if (
                    curSubQ > -1 &&
                    mod.value.question!.subquestions[curSubQ].pool_required
                  ) {
                    if (
                      !mod.value.answers ||
                      (mod.value.answers &&
                        !mod.value.answers.answers.hasOwnProperty(curSubQ)) ||
                      (mod.value.answers &&
                        mod.value.answers.answers.hasOwnProperty(curSubQ) &&
                        ((typeof mod.value.answers.answers[curSubQ] ===
                          "string" &&
                          typeof mod.value.answers.answers[curSubQ]) ||
                          mod.value.answers.answers[curSubQ].length === 0))
                    ) {
                      setRequired(true);
                      return;
                    }
                  }
                  setCurSubQ((prev) => prev + 1);
                }}
                disabled={
                  curSubQ >= mod.value.question!.subquestions.length - 1
                }
              >
                <BiChevronRight className="w-4 h-4" />
              </FilledButton>
            </div>
          }
        </Layout.Footer>
      </Layout>
    </div>
  );
}
