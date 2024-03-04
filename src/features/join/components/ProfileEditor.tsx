import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import {
  setAnonymous,
  setParticipantDisplayColor,
  setParticipantDisplayEmoji,
  setParticipantDisplayName,
} from "@/features/auth/slice";
import { checkLqs, setLqs } from "@/features/live/store/lqs-slice";
import { isAxiosError } from "axios";
import { CSSProperties, Dispatch, FormEvent, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilledButton from "@/common/components/buttons/FilledButton";
import CustomUserCard from "@/common/components/cards/CustomUserCard";
import UserCard from "@/common/components/cards/UserCard";
import wsStatuses from "@/features/live/utils/statuses";
import { setQuizTitle, setStatus } from "@/features/live/store/mod-slice";

type Props = {
  style?: CSSProperties;
  setStep: Dispatch<SetStateAction<number>>;
};

export default function ProfileEditor({ style }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const auth = useTypedSelector((state) => state.auth);
  const [searchParams, _] = useSearchParams();

  function onLogIn(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.location.href = `${
      import.meta.env.VITE_MANAGEMENT_URL
    }/login?${searchParams.toString()}`;
  }

  async function onJoin(e: FormEvent<HTMLButtonElement>, anon: boolean) {
    e.preventDefault();
    dispatch(setAnonymous(anon));
    const res = await dispatch(
      checkLqs(searchParams.get("code") || "")
    ).unwrap();
    if (isAxiosError(res)) {
      console.error(res as Error);
      return;
    } else if (res instanceof Error) {
      console.error(res as Error);
      return;
    }
    dispatch(
      setLqs({
        id: res.id,
        quizId: res.quiz_id,
        code: res.code,
      })
    );
    dispatch(setQuizTitle(res.quiz_title));
    dispatch(setStatus(res.status));
    if (!anon && auth.value.token) {
      dispatch(setParticipantDisplayName(auth.value.user.displayName));
      dispatch(setParticipantDisplayColor(auth.value.user.displayColor));
      dispatch(setParticipantDisplayEmoji(auth.value.user.displayEmoji));
    }
    if (res.status === wsStatuses.IDLE) {
      navigate(`/${res.code}/lobby`);
    } else {
      navigate(`/${res.code}/quiz`);
    }
  }

  return (
    <div className="absolute w-full h-full flex justify-center items-center font-sans-serif">
      <div
        className="absolute top-1/2 flex flex-col space-y-16 tems-center justify-center w-full h-full container transition-all duration-500"
        style={style}
      >
        <div className="w-full space-y-10 flex flex-col items-center justify-center">
          <h1 className="mb-1 font-serif text-header-1">
            Continue with a profile
          </h1>
          <CustomUserCard
            className="max-w-[95%]"
            displayName={auth.value.participant.displayName}
            displayColor={auth.value.participant.displayColor}
            displayEmoji={auth.value.participant.displayEmoji}
            onDisplayNameChange={(e) =>
              dispatch(setParticipantDisplayName(e.currentTarget.textContent!))
            }
            onDisplayColorChange={(e) =>
              dispatch(setParticipantDisplayColor(e.currentTarget.value))
            }
            onDisplayEmojiChange={(e) =>
              dispatch(setParticipantDisplayEmoji(e.currentTarget.value))
            }
          />
          <FilledButton
            type="button"
            className="!px-12 bg-sienna text-header-3"
            onClick={(e) => onJoin(e, true)}
            disabled={
              !auth.value.participant ||
              !auth.value.participant.displayName ||
              !auth.value.participant.displayColor ||
              !auth.value.participant.displayEmoji
            }
          >
            Join as anonymous
          </FilledButton>
        </div>
        <div className="w-5/6 md:w-3/5 relative mx-auto">
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-denim p-2">
            or
          </span>
          <hr className="w-full" />
        </div>
        {auth.value.token ? (
          <div className="space-y-10 flex flex-col items-center justify-center">
            <UserCard user={auth.value.user} size="md" />
            <FilledButton
              type="button"
              className="!px-12 bg-sienna text-header-3"
              onClick={(e) => onJoin(e, false)}
            >
              Join as {auth.value.user.displayName}
            </FilledButton>
          </div>
        ) : (
          <FilledButton
            type="button"
            className="mx-auto !px-12 bg-sienna text-header-3 w-fit"
            onClick={onLogIn}
          >
            Log in
          </FilledButton>
        )}
      </div>
    </div>
  );
}
