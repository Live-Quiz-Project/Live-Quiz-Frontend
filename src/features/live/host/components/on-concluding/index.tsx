import { FormEvent, useState } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { TbLogout } from "react-icons/tb";
import { IoIosPodium } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { endLqs } from "@/features/live/store/lqs-slice";
import logo from "@/common/assets/logo-alt.png";
import Podiums from "@/features/live/host/components/on-concluding/Podiums";
import FilledButton from "@/common/components/buttons/FilledButton";
import BaseModal from "@/common/components/modals/BaseModal";

export default function OnIncluding() {
  const { code } = useParams();
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();
  const mod = useTypedSelector((state) => state.mod);
  const lqs = useTypedSelector((state) => state.lqs);
  const [isShownAnyway, setShownAnyway] = useState<boolean>(false);
  const [isDecidingToShow, setDecidingToShow] = useState<boolean>(false);

  async function onEnd(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(endLqs());
    navigate(`/config/${lqs.value.quizId}`, { replace: true });
  }

  return (
    <div className="bg-beige h-dvh">
      {(mod.value.config.leaderboard.after && !isShownAnyway) ||
      isShownAnyway ? (
        <Podiums onEnd={onEnd} />
      ) : (
        <div className="relative w-full h-full grid grid-rows-[auto_1fr] p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
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
          <div className="flex flex-col items-center justify-center w-full h-full space-y-[5vw] sm:space-y-[2vw]">
            <p className="text-center text-header-1 sm:text-[1.75em] font-serif leading-snug">
              Thank you for participating!
            </p>
            <div className="flex flex-col xs:flex-row items-center justify-center gap-[2vw]">
              <FilledButton
                onClick={() => setDecidingToShow(true)}
                className="group inline-flex font-sans-serif bg-denim text-beige 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit space-x-2 transition-all duration-300"
              >
                <IoIosPodium className="m-auto group-hover:scale-125 transition-all duration-300" />
                <p>Show Leaderboard</p>
              </FilledButton>
              <FilledButton
                onClick={onEnd}
                className="group inline-flex font-sans-serif bg-denim text-beige 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit space-x-2"
              >
                <p>End Quiz</p>
                <TbLogout className="m-auto group-hover:translate-x-2 transition-all duration-300" />
              </FilledButton>
            </div>
          </div>
          {isDecidingToShow && (
            <BaseModal
              setOpen={setDecidingToShow}
              className="space-y-6 !bg-beige"
            >
              <h1 className="text-header-1 text-center">
                Are you sure you want to show leaderboard?
                <em className="text-[0.75em] text-denim">
                  <br />
                  &#40;You have set to not show leaderboard after&#41;
                </em>
              </h1>
              <div className="flex justify-center items-center space-x-4">
                <FilledButton
                  type="button"
                  onClick={() => setDecidingToShow(false)}
                  className="border border-dune text-dune hover:bg-scarlet/70 hover:text-beige hover:border-transparent text-body-1 truncate transition-all duration-300"
                >
                  No
                </FilledButton>
                <FilledButton
                  type="button"
                  onClick={() => {
                    setDecidingToShow(false);
                    setShownAnyway(true);
                  }}
                  className="bg-denim text-white text-body-1 truncate"
                >
                  Yes
                </FilledButton>
              </div>
            </BaseModal>
          )}
        </div>
      )}
    </div>
  );
}
