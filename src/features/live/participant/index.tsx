import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { connect, disconnect } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";
import wsStatuses from "@/features/live/utils/statuses";
import OnStarting from "@/features/live/participant/components/OnStarting";
import OnQuestioning from "@/features/live/participant/components/OnQuestioning";
import OnAnswering from "@/features/live/participant/components/on-answering";
import OnRevealingAnswer from "@/features/live/participant/components/on-revealing-answer";
import OnConcluding from "@/features/live/participant/components/on-concluding";
import MediaTypes from "@/features/live/utils/media-types";

export default function ParticipantLiveQuiz() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const mod = useTypedSelector((state) => state.mod);

  useEffect(() => {
    dispatch(connect());
  }, []);

  if (code && mod.value.status === wsStatuses.STARTING) {
    return <OnStarting />;
  }

  if (
    mod.value.status === wsStatuses.QUESTIONING ||
    mod.value.status === wsStatuses.MEDIA
  ) {
    if (!code || !mod.value.question) return null;
    if (mod.value.question.mediaType === MediaTypes.IMAGE) {
      const img = new Image();
      img.src = `${
        import.meta.env.VITE_FIREBASE_STORAGE_BASE_URL
      }/${encodeURIComponent(mod.value.question!.media)}?alt=media`;
    }
    return <OnQuestioning />;
  }

  if (mod.value.status === wsStatuses.ANSWERING) {
    if (
      !mod.value.question ||
      !(mod.value.question.options || mod.value.question.subquestions)
    )
      return null;
    return <OnAnswering />;
  }

  if (mod.value.status === wsStatuses.REVEALING_ANSWER) {
    if (!code || !mod.value.question) return null;
    return <OnRevealingAnswer />;
  }

  if (mod.value.status === wsStatuses.CONCLUDING) {
    if (!code) return null;
    return <OnConcluding />;
  }

  if (
    mod.value.status === wsStatuses.ENDING ||
    mod.value.status === wsStatuses.IDLE
  ) {
    dispatch(resetMod());
    dispatch(disconnect());
    navigate("/join", { replace: true });
  }
}
