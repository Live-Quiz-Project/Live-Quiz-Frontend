import { useDispatch } from "react-redux";
import { connect } from "@/features/live/store/lqs-slice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import wsStatuses from "@/features/live/utils/statuses";
import OnStarting from "@/features/live/host/components/OnStarting";
import OnQuestioning from "@/features/live/host/components/OnQuestioning";
import OnMedia from "@/features/live/host/components/OnMedia";
import OnAnswering from "@/features/live/host/components/on-answering";
import OnRevealingAnswer from "@/features/live/host/components/on-revealing-answer";
import OnConcluding from "@/features/live/host/components/on-concluding";
import MediaTypes from "@/features/live/utils/media-types";

export default function HostLiveQuiz() {
  const { code } = useParams();
  const dispatch = useDispatch();
  const mod = useTypedSelector((state) => state.mod);

  useEffect(() => {
    dispatch(connect());
  }, []);

  if (code && mod.value.status === wsStatuses.STARTING) {
    return <OnStarting />;
  }

  if (mod.value.status === wsStatuses.QUESTIONING) {
    if (!code || !mod.value.question) return null;
    if (mod.value.question.mediaType === MediaTypes.IMAGE) {
      const img = new Image();
      img.src = `${
        import.meta.env.VITE_FIREBASE_STORAGE_BASE_URL
      }/${encodeURIComponent(mod.value.question!.media)}?alt=media`;
    }
    return <OnQuestioning />;
  }

  if (mod.value.status === wsStatuses.MEDIA) {
    if (!code || !mod.value.question) return null;
    return <OnMedia />;
  }

  if (mod.value.status === wsStatuses.ANSWERING) {
    if (!mod.value.question || !mod.value.question.options) return null;
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

  return null;
}
