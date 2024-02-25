import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { connect, disconnect } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";
import wsStatuses from "@/features/live/utils/statuses";
import UserCard from "@/common/components/cards/UserCard";
import Layout from "@/common/layouts/Live";
import logo from "@/common/assets/logo-dark.png";

export default function ParticipantLobby() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const lqs = useTypedSelector((state) => state.lqs);
  const mod = useTypedSelector((state) => state.mod);
  const auth = useTypedSelector((state) => state.auth);

  useEffect(() => {
    dispatch(connect());
    dispatch(resetMod());
  }, []);

  useEffect(() => {
    if (!lqs.value.code || !lqs.value.id || !lqs.value.quizId) {
      navigate("/join", { replace: true });
    }
  }, [lqs.value]);

  useEffect(() => {
    if (mod.value.status === wsStatuses.STARTING) {
      navigate(`/${code}/quiz`, { replace: true });
    } else if (mod.value.status === wsStatuses.ENDING) {
      dispatch(resetMod());
      onLeave();
    }
  }, [mod.value.status]);

  function onLeave() {
    dispatch(disconnect());
    navigate("/join", { replace: true });
  }

  if (mod.value.status === wsStatuses.ENDING) {
    dispatch(resetMod());
    dispatch(disconnect());
    navigate("/join", { replace: true });
    return null;
  }

  return (
    <Layout>
      <Layout.Content className="relative text-dune bg-egg-sour grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw]">
        <img src={logo} alt="logo" className="w-44 xs:w-52 2xl:w-[12vw]" />
        <div className="grid grid-rows-[1fr_auto_1fr] gap-[1.25em] items-center text-header-2 2xl:text-[1.25vw] text-center w-full text-wrap leading-tight font-serif">
          <p className="self-end">
            Look at the host screen!
            <br />
            You've joined as
          </p>
          <div className="w-full flex justify-center items-center">
            <UserCard
              className="!bg-dune !text-beige"
              user={{
                displayName: auth.value.participant!.displayName,
                displayEmoji: auth.value.participant!.displayEmoji,
                displayColor: auth.value.participant!.displayColor,
              }}
              size="lg"
            />
          </div>
          <p className="self-start">Waiting for others to join...</p>
        </div>
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  );
}
