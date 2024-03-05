import { useEffect, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useNavigate, useParams } from "react-router-dom";
import logo from "@/common/assets/logo-dark.png";
import crown from "@/common/assets/crown.png";
import UserCard from "@/common/components/cards/UserCard";
import FilledButton from "@/common/components/buttons/FilledButton";
import { TbLogout } from "react-icons/tb";
import { disconnect } from "@/features/live/store/lqs-slice";
import { useDispatch } from "react-redux";

export default function Podiums() {
  const { code } = useParams();
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();
  const auth = useTypedSelector((state) => state.auth);
  const participants = useTypedSelector((state) => state.participants);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [participant, setParticipant] = useState<
    (User & { marks: number }) | null
  >(null);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 10);
    setParticipant(
      participants.value.find((p) => p.id === auth.value.participant.id) || null
    );

    return () => setIsMounted(false);
  }, []);

  async function onLeave() {
    dispatch(disconnect());
    navigate("/join", { replace: true });
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start overflow-hidden p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0">
      <div className="flex justify-between items-center w-full font-bold">
        <img
          src={logo}
          alt="logo"
          className="w-32 xs:w-44 md:w-52 2xl:w-[12vw]"
        />
        <p className="text-header-1 sm:text-[1.75em] font-sans-serif">
          &#35;{code}
        </p>
      </div>
      <div className="-ml-[2vw] p-2 xs:p-4 md:p-6 lg:p-8 2xl:p-[2vw] !pb-0 w-full h-full flex justify-center items-end">
        {participant && (
          <div
            className={`relative w-[80%] md:w-[55%] bg-sienna rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw] transition-all duration-1000 flex flex-col justify-between items-center ${
              isMounted
                ? "h-[75%] p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]"
                : "h-0"
            }`}
          >
            {participants.value.indexOf(participant) + 1 === 1 && (
              <img
                src={crown}
                alt="crown"
                className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-[20%] rotate-[3.5deg]"
              />
            )}
            <div
              className={`absolute bottom-0 left-full w-96 border-t-transparent border-l-dune transition-all duration-700 h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] border-l-[6vw] ${
                isMounted ? "border-t-[15vw]" : ""
              }`}
            />
            <div
              className={`w-full overflow-hidden flex flex-col items-center space-y-[6vw] md:space-y-[2vw] ${
                isMounted ? "h-full" : "h-0"
              }`}
            >
              <h1 className="text-header-1 2xl:text-[2vw] font-sans-serif w-[10vw] h-[10vw] sm:w-[4vw] sm:h-[4vw] 2xl:w-[2vw] 2xl:h-[2vw] inline-flex items-center justify-center bg-koromiko rounded-full">
                {participants.value.indexOf(participant) + 1}
              </h1>
              <UserCard
                className="!bg-dune !text-beige !h-16 lg:!h-24 2xl:!h-[5vw] !text-header-2 lg:!text-header-1 2xl:!text-[1.5vw] !p-1 lg:!p-1.5"
                user={participant}
                size="md"
              />
              <p className="!m-2 font-sans-serif text-[1em] xs:text-[1.15em] md:text-[1.5em] 2xl:text-[1.25vw]">
                {participant.marks} Marks
              </p>
            </div>
            <FilledButton
              onClick={onLeave}
              className="space-x-2 group inline-flex font-sans-serif bg-dune text-beige 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit"
            >
              <p>Leave</p>
              <TbLogout className="m-auto group-hover:translate-x-2 transition-all duration-300" />
            </FilledButton>
          </div>
        )}
      </div>
    </div>
  );
}
