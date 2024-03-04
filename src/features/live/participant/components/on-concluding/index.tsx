import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { TbLogout } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { disconnect } from "@/features/live/store/lqs-slice";
import logo from "@/common/assets/logo-dark.png";
import Podiums from "@/features/live/participant/components/on-concluding/Podiums";
import FilledButton from "@/common/components/buttons/FilledButton";

export default function OnIncluding() {
  const { code } = useParams();
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();
  const mod = useTypedSelector((state) => state.mod);

  async function onLeave() {
    dispatch(disconnect());
    navigate("/join", { replace: true });
  }

  return (
    <div className="bg-egg-sour h-dvh">
      {mod.value.config.leaderboard.after ? (
        <Podiums />
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
                onClick={onLeave}
                className="group inline-flex font-sans-serif bg-sienna text-beige 2xl:!py-[0.45vw] 2xl:!px-[1vw] text-body-1 md:text-header-2 2xl:text-[1vw] h-fit w-fit space-x-2"
              >
                <p>Leave</p>
                <TbLogout className="m-auto group-hover:translate-x-2 transition-all duration-300" />
              </FilledButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
