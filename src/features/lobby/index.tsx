import { useParams } from "react-router-dom";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import HostLobby from "@/features/lobby/Host";
import ParticipantLobby from "@/features/lobby/Participant";

export default function Lobby() {
  const { code } = useParams();
  const auth = useTypedSelector((state) => state.auth);

  if (code && auth.value.user.isHost) {
    return <HostLobby />;
  }

  if (code && !auth.value.user.isHost) {
    return <ParticipantLobby />;
  }
}
