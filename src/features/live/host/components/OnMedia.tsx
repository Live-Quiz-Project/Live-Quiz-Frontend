import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { http } from "@/common/services/axios";
import Layout from "@/common/layouts/Live";
import wsStatuses from "@/features/live/utils/statuses";
import MediaTypes from "@/features/live/utils/media-types";
import FilledButton from "@/common/components/buttons/FilledButton";
import OutlinedButton from "@/common/components/buttons/OutlinedButton";
import ProgressBarTimer from "@/common/components/ProgressBarTimer";
import NumberedTimer from "@/common/components/NumberedTimer";
import { PiPersonFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import QuestionTypesEnum from "@/common/utils/question-types";

export default function OnMedia() {
  const { code } = useParams();
  const mod = useTypedSelector((state) => state.mod);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [pending, setPending] = useState<boolean>(false);
  const [isSkipButtonShown, setSkipButtonShown] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft === 15 && mod.value.status === wsStatuses.MEDIA) {
      (async () => setTimeout(() => setTimeLeft(timeLeft - 0.1), 1))();
    }

    return () => {
      setTimeLeft(15);
      setPending(false);
    };
  }, []);

  useEffect(() => {
    if (mod.value.timeLeft) {
      setTimeLeft(mod.value.timeLeft - 0.1);
    }
  }, [mod.value.timeLeft, timeLeft]);

  return (
    <Layout>
      <Layout.Content
        className={`relative text-dune bg-quartz flex flex-col space-y-4 2xl:space-y-[1vw] font-serif overflow-hidden p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] ${
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
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center gap-[1em] w-full leading-tight font-serif">
            <span className="translate-x-1/4 text-[2.25em] -rotate-[25deg] text-denim">
              ?
            </span>
            <MathJax className="tracking-tight font-medium text-left text-[1.75em] w-full truncate leading-[1.75]">
              {mod.value.question!.type === QuestionTypesEnum.FILL_BLANK
                ? "Fill in the blanks"
                : mod.value.question!.content}
            </MathJax>
          </div>
        </div>
        <div className="flex-1 w-full h-full overflow-hidden bg-white border rounded-3xl">
          {mod.value.question!.mediaType === MediaTypes.IMAGE && (
            <img
              src={`${
                import.meta.env.VITE_FIREBASE_STORAGE_BASE_URL
              }/${encodeURIComponent(mod.value.question!.media)}?alt=media`}
              alt={mod.value.question!.media}
              className="object-contain w-full h-full"
              loading="lazy"
            />
          )}
        </div>
        {pending && (
          <div className="!m-0 z-10 fixed top-0 left-0 h-screen w-screen bg-dune/50 flex justify-center items-center">
            <span className="animate-[spin_3s_linear_infinite] w-10 h-10 border-8 border-dotted rounded-full border-white" />
          </div>
        )}
      </Layout.Content>
      <Layout.Footer className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-center gap-x-[3vw] sm:gap-x-[2%] px-[5%] 2xl:px-[2vw] gap-y-[10%]">
        <div className="flex justify-end items-center h-full w-full">
          <ProgressBarTimer
            className="hidden sm:block [&>div]:bg-jordy-blue [&>div>span]:bg-denim"
            timeLeft={timeLeft}
            maxTime={15}
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
        <div className="flex justify-end items-center gap-[1vw] sm:gap-[0.45vw]">
          <PiPersonFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
          <p className="text-[1em] xs:text-[1.15em] md:text-[1.5em] leading-none">
            {mod.value.participantCount}
          </p>
        </div>
      </Layout.Footer>
    </Layout>
  );
}
