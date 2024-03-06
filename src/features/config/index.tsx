import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import {
  createLqs,
  disconnect,
  resetLqs,
  setLqs,
} from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";
import { resetParticipants } from "@/features/live/store/participants-slice";
import { resetParticipant } from "@/features/auth/slice";
import FilledButton from "@/common/components/buttons/FilledButton";
import BaseAccordion from "@/common/components/accordions/BaseAccordion";
import BaseSwitch from "@/common/components/switches/BaseSwitch";
import logo from "@/common/assets/logo-light.png";

export default function Config() {
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const [viewLeaderboardDuringQuestions] = useState<boolean>(true);
  const [viewLeaderboardAfterQuestions, setViewLeaderboardAfterQuestions] =
    useState<boolean>(true);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [colorlessOptions, setColorlessOptions] = useState<boolean>(false);
  const [reanswer, setReanswer] = useState<boolean>(true);
  const [showCorrectAnswers] = useState<boolean>(true);
  const { quizId } = useParams();

  useEffect(() => {
    dispatch(disconnect());
    dispatch(resetParticipant());
    dispatch(resetMod());
    dispatch(resetLqs());
    dispatch(resetParticipants());
  }, []);

  async function onStart(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!quizId) return;
    const res = await dispatch(
      createLqs({
        quizId: quizId,
        config: {
          shuffle: {
            question: shuffleQuestions,
            option: shuffleOptions,
          },
          participant: {
            reanswer: reanswer,
          },
          leaderboard: {
            during: viewLeaderboardDuringQuestions,
            after: viewLeaderboardAfterQuestions,
          },
          option: {
            colorless: colorlessOptions,
            show_correct_answer: showCorrectAnswers,
          },
        },
      })
    ).unwrap();
    if (isAxiosError(res)) {
      console.error(res);
      return;
    } else if (res instanceof Error) {
      console.error(res as Error);
      return;
    } else {
      dispatch(
        setLqs({
          id: res.id,
          code: res.code,
          quizId: res.quiz_id,
        })
      );
      navigate(`/${res.code}/lobby`);
    }
  }

  return (
    <div className="p-4 flex items-center justify-center h-screen text-white bg-denim font-sans-serif">
      <div className="container w-full h-full grid grid-rows-[4fr_auto_3fr] items-center justify-items-center gap-4 xs:gap-8 md:gap-10 2xl:gap-16 overflow-auto">
        <div className="self-end flex flex-col items-center space-y-2 xs:space-y-4">
          <img src={logo} alt="Logo" className="w-48 md:w-60 h-fit" />
          <h1 className="font-serif text-header-1">Live quiz configuration</h1>
        </div>
        <div className="w-full sm:w-3/4 xl:w-1/2 h-full space-y-2 font-serif overflow-auto">
          <BaseAccordion init={true}>
            <BaseAccordion.Head className="flex items-center text-header-3 xs:text-header-2 font-semibold w-full h-10 overflow-hidden">
              <p className="inline truncate">Leaderboard</p>
            </BaseAccordion.Head>
            <BaseAccordion.Body className="text-body-1 xs:text-header-3 indent-4 font-thin">
              {/* <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">During questions</p>
                <BaseSwitch
                  checked={viewLeaderboardDuringQuestions}
                  setChecked={setViewLeaderboardDuringQuestions}
                  className="!h-6"
                />
              </div> */}
              <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Show leaderboard</p>
                <BaseSwitch
                  checked={viewLeaderboardAfterQuestions}
                  setChecked={setViewLeaderboardAfterQuestions}
                  className="!h-6"
                />
              </div>
            </BaseAccordion.Body>
          </BaseAccordion>
          <BaseAccordion init={true}>
            <BaseAccordion.Head className="flex items-center text-header-3 xs:text-header-2 font-semibold w-full h-10 overflow-hidden">
              <p className="inline truncate">Options and Answer</p>
            </BaseAccordion.Head>
            <BaseAccordion.Body className="text-body-1 xs:text-header-3 indent-4 font-thin">
              <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Can be reanswered</p>
                <BaseSwitch
                  checked={reanswer}
                  setChecked={setReanswer}
                  className="!h-6"
                />
              </div>
              {/* <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Show correct answers and marks</p>
                <BaseSwitch
                  checked={showCorrectAnswers}
                  setChecked={setShowCorrectAnswers}
                  className="!h-6"
                />
              </div> */}
              <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Colorless options</p>
                <BaseSwitch
                  checked={colorlessOptions}
                  setChecked={setColorlessOptions}
                  className="!h-6"
                />
              </div>
            </BaseAccordion.Body>
          </BaseAccordion>
          <BaseAccordion init={true}>
            <BaseAccordion.Head className="flex items-center text-header-3 xs:text-header-2 font-semibold w-full h-10 overflow-hidden">
              <p className="inline truncate">Shuffle</p>
            </BaseAccordion.Head>
            <BaseAccordion.Body className="text-body-1 xs:text-header-3 indent-4 font-thin">
              <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Shuffle questions</p>
                <BaseSwitch
                  checked={shuffleQuestions}
                  setChecked={setShuffleQuestions}
                  className="!h-6"
                />
              </div>
              <div className="flex items-center justify-between py-1 space-x-4">
                <p className="truncate">Shuffle options</p>
                <BaseSwitch
                  checked={shuffleOptions}
                  setChecked={setShuffleOptions}
                  className="!h-6"
                />
              </div>
            </BaseAccordion.Body>
          </BaseAccordion>
        </div>
        <FilledButton
          className="self-start !px-12 bg-sienna w-fit text-header-3 xs:text-header-2"
          onClick={onStart}
        >
          Start
        </FilledButton>
      </div>
    </div>
  );
}
