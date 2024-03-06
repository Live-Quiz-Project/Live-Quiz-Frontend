import { useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { trigger } from "@/features/live/store/lqs-slice";
import { PiPersonFill } from "react-icons/pi";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Layout from "@/common/layouts/Live";
import Choice from "@/features/live/host/components/on-revealing-answer/choice";
import TrueFalse from "@/features/live/host/components/on-revealing-answer/true-false";
import FillBlank from "@/features/live/host/components/on-revealing-answer/FillBlank";
import Paragraph from "@/features/live/host/components/on-revealing-answer/Paragraph";
import Matching from "@/features/live/host/components/on-revealing-answer/Matching";
import Pool from "@/features/live/host/components/on-revealing-answer/Pool";
import FilledButton from "@/common/components/buttons/FilledButton";
import OutlinedButton from "@/common/components/buttons/OutlinedButton";
import Leaderboard from "@/features/live/host/components/on-revealing-answer/Leaderboard";
import wsActions from "@/features/live/utils/action-types";
import QuestionTypesEnum from "@/common/utils/question-types";

export default function OnRevealingAnswer() {
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);
  const [mode, setMode] = useState<number>(0);

  return (
    <Layout>
      <Layout.Content className="overflow-auto text-dune">
        {mode === 0 && (
          <>
            {mod.value.question!.type === QuestionTypesEnum.CHOICE && (
              <Choice />
            )}
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
            {mod.value.question!.type === QuestionTypesEnum.POOL && <Pool />}
          </>
        )}
        {mode === 1 && <Leaderboard />}
      </Layout.Content>
      <Layout.Footer className="grid grid-cols-[1fr_auto] px-[5%] 2xl:px-[2vw] gap-[3vw] sm:gap-[2%]">
        {mode === 0 ? (
          mod.value.config.leaderboard.after ? (
            <FilledButton
              type="button"
              onClick={() => setMode((prev) => prev + 1)}
              className="self-center place-self-end text-body-1 md:text-header-2 2xl:text-[1vw] bg-denim !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] w-fit h-fit transition-all duration-300"
            >
              Next
            </FilledButton>
          ) : (
            <div className="flex flex-col-reverse sm:flex-row justify-evenly sm:justify-end items-end sm:items-center gap-x-[1.5vw] 2xl:gap-x-[1%]">
              {mod.value.curQ < mod.value.totalQ && (
                <FilledButton
                  onClick={() =>
                    dispatch(trigger({ type: wsActions.NEXT_QUESTION }))
                  }
                  className="group inline-flex font-sans-serif bg-denim text-beige !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit"
                >
                  Next&nbsp;<span className="hidden sm:block">Question</span>
                  <span className="block sm:hidden">Q</span>
                  <FiArrowUpRight className="m-auto group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" />
                </FilledButton>
              )}
              {mod.value.curQ >= mod.value.totalQ && (
                <FilledButton
                  onClick={() =>
                    dispatch(trigger({ type: wsActions.CONCLUDE }))
                  }
                  className="group inline-flex font-sans-serif bg-denim text-beige !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit "
                >
                  Continue
                  <FiArrowRight className="hidden sm:block m-auto group-hover:translate-x-2 transition-all duration-300" />
                </FilledButton>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col-reverse sm:flex-row justify-evenly sm:justify-end items-end sm:items-center gap-x-[1.5vw] 2xl:gap-x-[1%]">
            <OutlinedButton
              type="button"
              onClick={() => setMode((prev) => prev - 1)}
              className="text-body-1 md:text-header-2 2xl:text-[1vw] border-beige/10 bg-beige/10 !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] w-fit h-fit transition-all duration-300"
            >
              Back
            </OutlinedButton>
            {mod.value.curQ < mod.value.totalQ && (
              <FilledButton
                onClick={() =>
                  dispatch(trigger({ type: wsActions.NEXT_QUESTION }))
                }
                className="group inline-flex font-sans-serif bg-denim text-beige !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit"
              >
                Next&nbsp;<span className="hidden sm:block">Question</span>
                <span className="block sm:hidden">Q</span>
                <FiArrowUpRight className="m-auto group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" />
              </FilledButton>
            )}
            {mod.value.curQ >= mod.value.totalQ && (
              <FilledButton
                onClick={() => dispatch(trigger({ type: wsActions.CONCLUDE }))}
                className="group inline-flex font-sans-serif bg-denim text-beige !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit "
              >
                Continue
                <FiArrowRight className="hidden sm:block m-auto group-hover:translate-x-2 transition-all duration-300" />
              </FilledButton>
            )}
          </div>
        )}
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
