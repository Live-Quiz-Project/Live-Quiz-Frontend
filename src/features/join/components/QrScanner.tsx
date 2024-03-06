import Scanner from "qr-scanner";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import QrFrame from "@/common/assets/qr-frame.svg";
import { IoClose } from "react-icons/io5";
import { LuSwitchCamera } from "react-icons/lu";

type Props = {
  setShown: Dispatch<SetStateAction<boolean>>;
  setReadQr: Dispatch<SetStateAction<string>>;
  setInvalid: Dispatch<SetStateAction<boolean>>;
};

export default function QrScanner({ setShown, setReadQr, setInvalid }: Props) {
  const scanner = useRef<Scanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [preferredCamera, setPreferredCamera] = useState<
    "user" | "environment"
  >("environment");

  const onScanSuccess = (result: Scanner.ScanResult) => {
    if (
      result?.data.startsWith(`${import.meta.env.VITE_BASE_URL}/join?code=`)
    ) {
      setReadQr(result?.data);
    } else {
      setInvalid(true);
    }
    setShown(false);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  const switchCamera = async () => {
    try {
      setPending(true);
      await scanner?.current?.setCamera(
        preferredCamera === "user" ? "environment" : "user"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
    setPreferredCamera((prevCamera) =>
      prevCamera === "user" ? "environment" : "user"
    );
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new Scanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera,
        highlightScanRegion: true,
        overlay: qrBoxEl?.current || undefined,
      });

      (async () => {
        setPending(true);
        try {
          await scanner?.current?.start();
        } catch (error) {
          console.log(error);
        } finally {
          setPending(false);
        }
      })();
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch(() => setQrOn(false));
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, [preferredCamera]);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="w-full h-full relative grid grid-rows-[1fr_auto_1fr]">
      <div className="absolute w-full h-full">
        <video ref={videoEl} className="w-full h-full object-cover" />
      </div>
      <div
        ref={qrBoxEl}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-96 max-h-96 m-auto"
      />
      <div className="w-full h-full bg-dune/50 z-1" />
      <div className="grid grid-cols-[1fr_auto_1fr] w-full h-full z-1">
        <div className="bg-dune/50" />
        <div className="w-[70vw] max-w-96 h-full">
          <img src={QrFrame} alt="qr-frame" className="w-full h-full" />
        </div>
        <div className="bg-dune/50" />
      </div>
      <div className="w-full h-full bg-dune/50 z-1" />
      <button
        type="button"
        onClick={() => setShown(false)}
        className="absolute top-[2vw] right-[2vw] z-1"
      >
        <IoClose className="text-white w-8 h-8" />
      </button>
      <button
        type="button"
        onClick={switchCamera}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white rounded-full p-3 z-1"
      >
        <LuSwitchCamera className="text-dune w-6 h-6" />
      </button>
      {pending && (
        <div className="absolute w-dvw h-dvh bg-dune/50 flex items-center justify-center">
          <span className="animate-[spin_3s_linear_infinite] w-10 h-10 border-8 border-dotted rounded-full" />
        </div>
      )}
    </div>
  );
}
