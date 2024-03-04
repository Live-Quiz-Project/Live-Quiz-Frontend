import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { GiPodium } from "react-icons/gi";
import UserCard from "@/common/components/cards/UserCard";

export default function Leaderboard() {
  const participants = useTypedSelector((state) => state.participants);

  return (
    <div className="bg-quartz grid grid-rows-[auto_1fr] gap-[1em] md:gap-[2em] justify-items-center items-center h-full">
      <div className="w-full flex items-center justify-center gap-[0.75em] xs:gap-[1.25em] p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
        <GiPodium
          className="text-denim w-[2em] h-[2em] xs:w-[3em] xs:h-[3em] 2xl:w-[2.5vw] 2xl:h-[2.5vw]"
          viewBox="0 0 512 650"
        />
        <h1 className="flex items-center font-serif text-[1em] xs:text-[1.75em]">
          Leaderboard
        </h1>
      </div>
      <div className="flex flex-col p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 w-full h-full gap-[0.5em] overflow-auto">
        {participants.value && participants.value.length > 0 ? (
          participants.value.map((p: any, i: number) => (
            <div
              key={p.id}
              className="w-full py-2 md:py-4 2xl:py-[1vw] px-3 xs:px-4 md:px-10 2xl:px-[2.5vw] bg-jordy-blue/50 flex items-center justify-between rounded-lg lg:rounded-xl 2xl:rounded-[1vw] border"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-[0.5em] xs:gap-[1em] 2xl:gap-[2em]">
                <p className="inline-flex text-body-1 sm:text-[1.5em] font-sans-serif bg-denim min-w-8 max-w-8 h-8 sm:min-w-12 sm:max-w-12 sm:h-12 2xl:min-w-[2.5vw] 2xl:max-w-[2.5vw] 2xl:h-[2.5vw] text-beige rounded-full justify-center items-center">
                  {i + 1}
                </p>
                <UserCard
                  className="peer !bg-dune !text-beige cursor-pointer !h-10 xs:!h-16 lg:!h-20 2xl:!h-[4.25vw] !text-header-3 xs:!text-header-2 lg:text-header-1 2xl:!text-[1.25vw] !p-1 lg:!p-1.5 overflow-hidden w-full"
                  size="md"
                  user={{
                    displayName: p.displayName,
                    displayColor: p.displayColor,
                    displayEmoji: p.displayEmoji,
                  }}
                />
              </div>
              <p className="inline text-[1.15em] sm:text-[1.35em] text-right font-sans-serif">
                {p.marks}
                <span className="hidden sm:inline text-right font-sans-serif">{` Mark${
                  p.marks !== 0 && p.marks !== 1 ? "s" : ""
                }`}</span>
              </p>
            </div>
          ))
        ) : (
          <em className="m-auto font-sans-serif text-[1.25em]">
            No participants... yet!
          </em>
        )}
      </div>
    </div>
  );
}
