import { FormEvent, useEffect, useState } from "react";
import KeyPad from "@/features/join/components/KeyPad";
import ProfileEditor from "@/features/join/components/ProfileEditor";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import { checkLqs, resetLqs } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";
import { IoArrowBack } from "react-icons/io5";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import {
  resetParticipant,
  resetParticipantDisplayData,
} from "@/features/auth/slice";

export default function Join() {
  const auth = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch<StoreDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>("");
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  );

  useEffect(() => {
    if (searchParams.get("code")) {
      setDigits(searchParams.get("code")!.split(""));
      onNext(undefined, searchParams.get("code")!);
      if (auth.value.token && !auth.value.anonymous) {
        dispatch(resetParticipantDisplayData());
      }
      if (searchParams.get("code") !== auth.value.participant?.code) {
        dispatch(resetParticipant());
      }
    }

    dispatch(resetLqs());
    dispatch(resetMod());
  }, [searchParams]);

  async function onNext(e?: FormEvent<HTMLFormElement>, c?: string) {
    if (e) e.preventDefault();
    let code: string;
    if (c) {
      code = c;
    } else {
      code = digits.join("");
    }

    digits.forEach((digit) => {
      if (!digit || !/^[A-Z]{2}\d{4}$/.test(code.toUpperCase())) {
        setError("Please enter a valid code");
        return;
      }
    });
    const res = await dispatch(checkLqs(code)).unwrap();
    if (isAxiosError(res)) {
      if (res.response?.status === 400) {
        setError(res.response.data.error);
      }
      setStep(0);
      return;
    } else if (res instanceof Error) {
      console.error(res as Error);
      setStep(0);
      return;
    }
    setSearchParams({ code: code });
    setStep(1);
  }

  return (
    <div className="flex items-center justify-center h-dvh text-white bg-denim w-full">
      <form
        onSubmit={onNext}
        className="relative w-full h-full overflow-hidden"
        autoComplete="off"
      >
        <KeyPad
          style={{
            transform: `translate(${step * -100}%, -50%)`,
            zIndex: step === 0 ? "1" : "-1",
          }}
          error={error}
          setError={setError}
          digits={digits}
          setDigits={setDigits}
          onNext={onNext}
        />
        <ProfileEditor
          setStep={setStep}
          style={{
            transform: `translate(${(step - 1) * -100}%, -50%)`,
            zIndex: step === 1 ? "1" : "-1",
          }}
        />
      </form>
      {step === 1 && (
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setSearchParams({});
            setDigits(Array.from({ length: 6 }, () => ""));
            setError(null);
          }}
          className="absolute top-5 left-5 w-5 md:w-6 h-5 md:h-6 z-10"
        >
          <IoArrowBack className="w-full h-full" />
        </button>
      )}
    </div>
  );
}
