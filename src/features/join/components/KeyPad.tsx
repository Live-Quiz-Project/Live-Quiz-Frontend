import logo from "@/common/assets/logo-light.png";
import { LuQrCode } from "react-icons/lu";
import { HiOutlineHashtag } from "react-icons/hi";
import {
  CSSProperties,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import QrScanner from "./QrScanner";
import BaseModal from "@/common/components/modals/BaseModal";

type Props = {
  style?: CSSProperties;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  digits: string[];
  setDigits: Dispatch<SetStateAction<string[]>>;
  onNext: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function KeyPad({
  style,
  error,
  setError,
  digits,
  setDigits,
  onNext,
}: Props) {
  const [next, setNext] = useState<boolean>(false);
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [readQr, setReadQr] = useState<string>("");
  const [invalid, setInvalid] = useState<boolean>(false);
  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        qrReaderRef.current &&
        !qrReaderRef.current.contains(e.target as Node)
      ) {
        setShowQrScanner(false);
      }
    }

    digitRefs[0].current?.focus();
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (next) {
      (async () => await onNext())();
      setNext(false);
    }
  }, [next]);

  useEffect(() => {
    console.log(readQr);
    if (readQr) {
      const code = new URL(readQr).searchParams.get("code");
      console.log(code);

      setDigits(code!.split(""));
      setNext(true);
    }
  }, [readQr]);

  useEffect(() => {
    if (invalid) {
      setTimeout(() => {
        setInvalid(false);
      }, 2000);
    }
  }, [invalid]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    setError(null);
    if (e.key === "Enter") {
      setNext(true);
    } else if (e.key === "ArrowLeft") {
      if (index - 1 >= 0) {
        digitRefs[index - 1].current?.focus();
      }
    } else if (e.key === "ArrowRight") {
      if (index + 1 < digitRefs.length) {
        digitRefs[index + 1].current?.focus();
      }
    } else if (e.key === "Backspace") {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      if (digits[index] === "" && index - 1 >= 0) {
        digitRefs[index - 1].current?.focus();
      }
    }
  }

  async function onInput(e: FormEvent<HTMLInputElement>, index: number) {
    e.preventDefault();
    setError(null);
    const newDigits = [...digits];

    if (e.currentTarget.value.length > 1) {
      let lastDigit = 0;
      const input = e.currentTarget.value.replace(/ /g, "").toUpperCase();
      for (let i = index; i < index + input.length; i++) {
        if (i > digitRefs.length - 1) break;
        newDigits[i] = input[i - index];
        lastDigit = i;
      }
      setDigits(newDigits);
      if (lastDigit + 1 < digitRefs.length) {
        digitRefs[lastDigit + 1].current?.focus();
        return;
      }
      digitRefs[digitRefs.length - 1].current?.focus();
      setNext(true);
      return;
    }
    newDigits[index] = e.currentTarget.value.toUpperCase();
    setDigits(newDigits);
    if (index + 1 < digitRefs.length) {
      digitRefs[index + 1].current?.focus();
    }
    if (index === digitRefs.length - 1) setNext(true);
  }

  return (
    <div className="absolute w-full h-full flex justify-center items-center">
      <div
        className="absolute top-1/2 flex flex-col w-full h-full items-center justify-center container transition-all duration-500"
        style={style}
      >
        <div className="space-y-6 w-max">
          <div className="flex flex-col items-center justify-center space-y-6">
            <img src={logo} alt="Logo" className="w-48 md:w-60" />
            <h1 className="font-serif leading-none text-header-1">
              Enter Quiz Code
            </h1>
          </div>
          <div className="relative flex flex-col items-center px-2.5 md:px-5 py-1.5 md:py-2 bg-white border rounded-full border-sienna">
            <div className="flex justify-center 2xs:h-7 xs:h-9 md:h-10 w-full space-x-1 md:space-x-1.5">
              <HiOutlineHashtag className="w-auto h-full text-sienna" />
              {digits.map((digit, i) => (
                <label
                  key={i}
                  className="relative h-full aspect-square font-sans-serif text-header-2"
                >
                  <input
                    ref={digitRefs[i]}
                    className="inline-flex items-center justify-center w-full h-full text-transparent rounded-md bg-egg-sour text-center focus:outline-none focus:ring-1 ring-sienna num-input-arrow-hidden"
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onInput={(e) => onInput(e, i)}
                    value=""
                    type={i > 1 ? "number" : "text"}
                    pattern={i > 1 ? "\\d*" : "[A-Za-z]"}
                    min="0"
                    max="9"
                    autoComplete="off"
                  />
                  <p className="absolute -translate-x-1/2 -translate-y-1/2 text-sienna top-1/2 left-1/2">
                    {digit}
                  </p>
                </label>
              ))}
              <button
                type="button"
                className="w-auto h-full aspect-square text-sienna"
                onClick={() => {
                  // setReadQr("");
                  setShowQrScanner(true);
                }}
              >
                <LuQrCode className="w-full h-full" />
              </button>
            </div>
            {error && (
              <p className="absolute font-sans-serif text-scarlet top-full text-body-1">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
      {showQrScanner && (
        <div className="fixed top-0 left-0 z-50 h-dvh w-screen flex items-center justify-center">
          <QrScanner
            setReadQr={setReadQr}
            setShown={setShowQrScanner}
            setInvalid={setInvalid}
          />
        </div>
      )}
      {invalid && (
        <BaseModal setOpen={setInvalid} className="text-dune">
          QR Code is invalid. Please try again.
        </BaseModal>
      )}
    </div>
  );
}
