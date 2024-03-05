import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { connect, endLqs, trigger } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { FaLock, FaUnlockKeyhole } from "react-icons/fa6";
import { PiPersonFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import wsActionTypes from "@/features/live/utils/action-types";
import wsStatuses from "@/features/live/utils/statuses";
import logo from "@/common/assets/logo-alt.png";
import QR from "react-qr-code";
import FilledButton from "@/common/components/buttons/FilledButton";
import OutlinedButton from "@/common/components/buttons/OutlinedButton";
import UserCard from "@/common/components/cards/UserCard";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import BaseModal from "@/common/components/modals/BaseModal";

export default function HostLobby() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const participants = useTypedSelector((state) => state.participants);
  const lqs = useTypedSelector((state) => state.lqs);
  const mod = useTypedSelector((state) => state.mod);
  const [kickedParticipant, setKickedParticipant] = useState<User | null>(null);
  const [isAscending, setAscending] = useState<boolean>(true);
  const [displayParticipants, setDisplayParticipants] = useState<User[]>([]);
  const [isQrExpanded, setQrExpanded] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 640) {
        setQrExpanded(false);
      }
    };

    dispatch(connect());
    dispatch(resetMod());

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (mod.value.status === wsStatuses.ENDING) {
      navigate(`/config/${lqs.value.quizId}`, { replace: true });
    }
  }, [mod.value.status]);

  useEffect(() => {
    if (participants.value && participants.value.length > 0) {
      let newParticipants = [...participants.value];
      newParticipants.sort((a, b) => {
        if (isAscending) {
          return a.displayName.localeCompare(b.displayName);
        } else {
          return b.displayName.localeCompare(a.displayName);
        }
      });
      setDisplayParticipants(newParticipants);
    } else {
      setDisplayParticipants([]);
    }
  }, [participants.value]);

  function onSort(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newParticipants = [...displayParticipants];
    newParticipants.sort((a, b) => {
      if (isAscending) {
        return b.displayName.localeCompare(a.displayName);
      } else {
        return a.displayName.localeCompare(b.displayName);
      }
    });
    setDisplayParticipants(newParticipants);
    setAscending((prev) => !prev);
  }

  async function onCancel(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    await dispatch(endLqs());
    navigate(`/config/${lqs.value.quizId}`, { replace: true });
  }

  function onStartQuiz(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(
      trigger({
        type: wsActionTypes.START_LQS,
        payload: { id: lqs.value.id },
      })
    );
    navigate(`/${code}/quiz`, { replace: true });
  }

  function onKickParticipant(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(
      trigger({
        type: wsActionTypes.KICK_PARTICIPANT,
        payload: {
          id: e.currentTarget.value,
        },
      })
    );
    setKickedParticipant(null);
  }

  return (
    <div className="h-screen grid grid-rows-[1fr_auto]">
      <div className="grid md:gap-x-10 lg:gap-x-20 xl:gap-x-40 gap-y-4 xs:gap-y-2 grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr] md:grid-rows-[auto_1fr] grid-flow-col h-full w-full mx-auto p-4 xs:p-6 md:p-12 lg:p-16 md:!pt-10 bg-quartz text-dune font-sans-serif">
        <div className="row-start-2 col-start-2 md:col-start-2 md:row-start-1 h-fit lg:h-10 flex items-center justify-end space-x-6 2xl:space-x-[1.25vw] mt-2 md:mt-0">
          <button
            type="button"
            value={mod.value.locked.toString()}
            onClick={() =>
              dispatch(trigger({ type: wsActionTypes.TOGGLE_LOCK }))
            }
            className="flex items-center justify-center"
          >
            {mod.value.locked ? (
              <FaLock className="w-4 md:w-5 2xl:w-[1.25vw] h-4 md:h-5 2xl:h-[1.25vw]" />
            ) : (
              <FaUnlockKeyhole className="w-4 md:w-5 2xl:w-[1.25vw] h-4 md:h-5 2xl:h-[1.25vw]" />
            )}
          </button>
          <div className="flex items-center space-x-1 h-full">
            <PiPersonFill className="w-5 md:w-6 2xl:w-[1.25vw] h-5 md:h-6 2xl:h-[1.25vw]" />
            <p className="font-sans-serif text-header-2 2xl:text-[1.25vw] leading-none">
              {displayParticipants.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onSort}
            className="flex items-center space-x-1 font-serif h-full"
          >
            <p className="text-header-1 2xl:text-[1.25vw] leading-none">Aa</p>
            <FiArrowDown
              className={`${
                isAscending && "rotate-180"
              } w-4 md:w-6 2xl:w-[1.25vw] h-4 md:h-6 2xl:h-[1.25vw] transition-all duration-300`}
            />
          </button>
        </div>
        <div className="col-span-2 md:col-span-1 md:row-span-2 relative flex flex-row md:flex-col justify-between">
          <div className="space-y-4 xs:space-y-6">
            <img src={logo} alt="Logo" className="w-44 xs:w-52 2xl:w-[15vw]" />
            <p className="text-header-2 2xl:text-[1.25vw] leading-tight font-serif break-all">
              Head over to
              <br />
              <em className="font-sans-serif font-medium text-[0.9em]">
                {import.meta.env.VITE_BASE_URL}
              </em>
              <br />
              and join with the code:
            </p>
            <p className="font-semibold text-6xl !leading-[0.8] sm:leading-none xs:text-7xl md:text-8xl 2xl:text-[5vw] font-sans-serif">
              {code}
            </p>
          </div>
          <div
            className={`fixed md:hidden top-0 left-0 h-screen w-screen bg-dune/50 flex items-center justify-center transition-all duration-300 ${
              isQrExpanded ? "opacity-100 z-10" : "opacity-0 -z-1"
            }`}
            onClick={() => setQrExpanded(false)}
          />
          <button
            type="button"
            className={`${
              isQrExpanded
                ? "w-3/4 sm:w-1/2 md:w-full p-3 md:p-0 rounded-xl sm:rounded-2xl md:rounded-none z-20 top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 md:translate-y-0"
                : "w-12 xs:w-20 md:w-full rounded-sm z-10 top-4 right-4 xs:top-6 xs:right-6"
            } bg-quartz fixed md:static overflow-hidden md:cursor-default transition-all duration-300`}
            onClick={() => setQrExpanded(true)}
            disabled={isQrExpanded}
          >
            <QR
              className="w-full h-full"
              value={`${import.meta.env.VITE_BASE_URL}/join?code=${code}`}
              fgColor="#322F2D"
              bgColor="transparent"
            />
          </button>
        </div>
        <div className="col-span-2 md:col-span-1 h-full overflow-auto">
          <div className="flex flex-wrap items-start gap-3 lg:gap-4">
            {displayParticipants.map((participant) => (
              <div key={participant.id + "md"} className="relative">
                <button
                  type="button"
                  onClick={() => setKickedParticipant(participant)}
                  className="cursor-default"
                >
                  <UserCard
                    className="peer !bg-dune !text-beige cursor-pointer !h-16 lg:!h-20 2xl:!h-[4.25vw] !text-header-2 lg:text-header-1 2xl:!text-[1.25vw] !p-1 lg:!p-1.5"
                    user={participant}
                    size="md"
                  />
                  <IoClose className="absolute top-0 right-0 w-5 h-5 text-scarlet bg-egg-sour rounded-full opacity-0 peer-hover:opacity-100 hover:opacity-100 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-dune h-16 xs:h-20 md:h-28 2xl:h-[10dvh] grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] items-center px-[0.5em] xs:px-[1em] md:px-[1.5em] gap-[0.5em] xs:gap-[1em] md:gap-[1.5em] font-sans-serif text-body-1 md:text-header-2 2xl:text-[1vw] text-center text-beige">
        <OutlinedButton
          className="self-center place-self-start border-beige/10 hover:bg-scarlet bg-sienna xs:bg-transparent !border xs:border !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] h-fit w-max transition-all duration-300"
          onClick={onCancel}
        >
          Cancel
        </OutlinedButton>
        <p className="hidden sm:block font-serif text-[1.5em] w-full truncate leading-normal font-medium">
          {mod.value.quizTitle}
        </p>
        <FilledButton
          className="self-center place-self-end group bg-beige/10 hover:bg-jordy-blue !px-2 md:!px-5 !py-1 xs:!py-2 2xl:!py-[0.45vw] 2xl:!px-[1vw] h-fit w-max inline-flex justify-center items-center transition-all duration-300 hover:text-dune"
          onClick={onStartQuiz}
        >
          Start Live Quiz
          <FiArrowUpRight className="hidden sm:block h-fit group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:text-dune transition-all duration-300" />
        </FilledButton>
      </div>
      {kickedParticipant && (
        <BaseModal
          setOpen={setKickedParticipant}
          className="space-y- !bg-beige"
        >
          <h1 className="text-header-1 truncate">
            Are you sure you want to kick&nbsp;
            <em>{kickedParticipant.displayName}</em>&nbsp;?
          </h1>
          <div className="flex justify-center items-center space-x-4">
            <FilledButton
              type="button"
              onClick={() => setKickedParticipant(null)}
              className="border border-dune text-dune hover:bg-scarlet/70 hover:text-beige hover:border-transparent text-body-1 truncate transition-all duration-300"
            >
              Not now
            </FilledButton>
            <FilledButton
              type="button"
              value={kickedParticipant.id}
              onClick={onKickParticipant}
              className="bg-denim text-white text-body-1 truncate"
            >
              Kick&nbsp;
              <em>{kickedParticipant.displayName}</em>
            </FilledButton>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
