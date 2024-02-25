import { trigger } from "@/features/live/store/lqs-slice";
import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import FilledButton from "@/common/components/buttons/FilledButton";
import wsActions from "@/features/live/utils/action-types";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import UserCard from "@/common/components/cards/UserCard";

type Props = {
  setMode: Dispatch<SetStateAction<number>>;
};

export default function Leaderboard({ setMode }: Props) {
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);

  return (
    <div className="bg-quartz grid grid-rows-[auto_1fr] gap-[1em] md:gap-[2em] justify-items-center items-center h-full">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-[0.5em] xs:gap-[1em] items-center justify-items-center w-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
        <FilledButton
          onClick={() => setMode((prev) => prev - 1)}
          className="font-sans-serif bg-dune text-beige !p-2 md:!px-5 xs:!py-3 text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-max self-center place-self-start"
        >
          Back
        </FilledButton>
        <h1 className="flex items-center font-serif text-[1em] xs:text-[1.75em]">
          Leaderboard
        </h1>
        {mod.value.curQ < mod.value.totalQ && (
          <FilledButton
            onClick={() => dispatch(trigger({ type: wsActions.NEXT_QUESTION }))}
            className="group inline-flex font-sans-serif bg-denim text-beige !p-2 md:!px-5 xs:!py-3 text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-max self-center place-self-end"
          >
            Next&nbsp;<span className="hidden sm:block">Question</span>
            <FiArrowUpRight className="hidden sm:block m-auto group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" />
          </FilledButton>
        )}
        {mod.value.curQ >= mod.value.totalQ && (
          <FilledButton
            onClick={() => dispatch(trigger({ type: wsActions.CONCLUDE }))}
            className="group inline-flex font-sans-serif bg-denim text-beige !p-2 md:!px-5 xs:!py-3 text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-max self-center place-self-end"
          >
            Continue
            <FiArrowRight className="hidden sm:block m-auto group-hover:translate-x-2 transition-all duration-300" />
          </FilledButton>
        )}
      </div>
      <div className="flex flex-col p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 w-full h-full gap-[0.5em] overflow-auto">
        {mod.value.answers.leaderboard &&
        mod.value.answers.leaderboard.length > 0 ? (
          mod.value.answers.leaderboard.map((a: any, i: number) => (
            <div
              key={a.id}
              className="w-full py-2 md:py-4 2xl:py-[1vw] px-3 xs:px-4 md:px-10 2xl:px-[2.5vw] bg-jordy-blue/50 flex items-center justify-between rounded-lg lg:rounded-xl 2xl:rounded-[1vw]"
            >
              <div className="flex items-center gap-[0.5em] xs:gap-[1em] 2xl:gap-[2em]">
                <p className="inline-flex text-body-1 sm:text-[1.5em] font-sans-serif bg-denim w-8 h-8 sm:w-12 sm:h-12 2xl:w-[2.5vw] 2xl:h-[2.5vw] text-beige rounded-full justify-center items-center">
                  {i + 1}
                </p>
                <UserCard
                  className="peer !bg-dune !text-beige cursor-pointer !h-10 xs:!h-16 lg:!h-20 2xl:!h-[4.25vw] !text-header-2 lg:text-header-1 2xl:!text-[1.25vw] !p-1 lg:!p-1.5"
                  size="md"
                  user={{
                    displayName: a.display_name,
                    displayColor: a.display_color,
                    displayEmoji: a.display_emoji,
                  }}
                />
              </div>
              <p className="inline text-[1.15em] sm:text-[1.35em] text-right font-sans-serif">
                {a.marks}
                <span className="hidden sm:inline text-right font-sans-serif">{` Mark${
                  a.marks !== 0 && a.marks !== 1 ? "s" : ""
                }`}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="m-auto font-sans-serif text-regent-gray">
            - No participants -
          </p>
        )}
      </div>
    </div>
  );
}
