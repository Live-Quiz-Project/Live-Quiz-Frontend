import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { setAnswers } from "@/features/live/store/mod-slice";
import { trigger } from "@/features/live/store/lqs-slice";
import {
  MdOutlineAudioFile,
  MdOutlineImage,
  MdOutlineVideoCameraBack,
} from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import Layout from "@/common/layouts/Live";
import Unanswered from "@/features/live/participant/components/on-answering/matching/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/matching/Answered";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import NumberedTimer from "@/common/components/NumberedTimer";
import FilledButton from "@/common/components/buttons/FilledButton";
import wsActions from "@/features/live/utils/action-types";
import MediaTypes from "@/features/live/utils/media-types";

type Props = {
  timeLeft: number;
};

export default function Matching({ timeLeft }: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const mod = useTypedSelector((state) => state.mod);
  const [notAllAnswered, setNotAllAnswered] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [x: string]: string;
  }>(
    (mod.value.question!.options as MatchingOption).prompts.reduce(
      (acc, p) => ({ ...acc, [p.id]: "" }),
      {}
    )
  );
  const [isMediaShown, setMediaShown] = useState<boolean>(false);
  const handlers = useSwipeable({
    onSwipedUp: () => setMediaShown(true),
    onSwipedDown: () => setMediaShown(false),
  });
  const mediaRef = useRef<HTMLDivElement>(null);

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

  function onSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (Object.values(selectedOptions).some((o) => o === "")) {
      setNotAllAnswered(true);
      return;
    }
    setMediaShown(false);
    setNotAllAnswered(false);
    dispatch(
      setAnswers({
        answers: Object.entries(selectedOptions).map(
          ([promptId, optionId]) => ({
            prompt: promptId,
            option: optionId,
          })
        ),
        time: Math.round((mod.value.question!.timeLimit - timeLeft) * 10),
        marks: null,
      })
    );
    dispatch(
      trigger({
        type: wsActions.SUBMIT_ANSWER,
        payload: {
          pid: auth.value.participant.id,
          qid: mod.value.question!.id,
          type: mod.value.question!.type,
          time: Math.round((mod.value.question!.timeLimit - timeLeft) * 10),
          options: Object.entries(selectedOptions).map(
            ([promptId, optionId]) => ({
              prompt: promptId,
              option: optionId,
            })
          ),
        } as AnswerResponse,
      })
    );
  }

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
          {(!mod.value.answers ||
            (mod.value.answers && mod.value.answers.answers.length) <= 0) && (
            <Unanswered
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              notAllAnswered={notAllAnswered}
            />
          )}
          {mod.value.answers && mod.value.answers.answers.length > 0 && (
            <Answered />
          )}
          {mod.value.question!.mediaType !== "" &&
            (!mod.value.answers ||
              (mod.value.answers.answers && mod.value.answers.answers.length) <=
                0) && (
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
          {(!mod.value.answers ||
            (mod.value.answers && mod.value.answers.answers.length <= 0)) && (
            <FilledButton
              className="bg-sienna !p-2 md:!px-5 xs:!py-3 text-body-1 md:text-header-2 2xl:text-[1vw] h-fit"
              onClick={onSubmit}
            >
              Submit
            </FilledButton>
          )}
        </Layout.Footer>
      </Layout>
    </div>
  );
}
