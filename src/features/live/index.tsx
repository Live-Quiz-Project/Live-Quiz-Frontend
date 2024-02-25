import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useParams } from "react-router-dom";
import HostLiveQuiz from "@/features/live/host";
import ParticipantLiveQuiz from "@/features/live/participant";

export default function LiveQuiz() {
  const { code } = useParams();
  const auth = useTypedSelector((state) => state.auth);

  if (!code) {
    return null;
  }

  if (auth.value.user.isHost) {
    return <HostLiveQuiz />;
  }

  if (!auth.value.user.isHost) {
    return <ParticipantLiveQuiz />;
  }
}
