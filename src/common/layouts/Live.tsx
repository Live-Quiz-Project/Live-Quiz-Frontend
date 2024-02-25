import { Children, FormEvent, ReactElement, ReactNode, useState } from "react";
import QR from "react-qr-code";
import OutlinedButton from "@/common/components/buttons/OutlinedButton";
import { disconnect, endLqs } from "@/features/live/store/lqs-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useParams } from "react-router-dom";

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function Layout({ children, className }: Props) {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<StoreDispatch>();
  const lqs = useTypedSelector((state) => state.lqs);
  const auth = useTypedSelector((state) => state.auth);
  const [isQrExpanded, setQrExpanded] = useState<boolean>(false);

  async function onCancel(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(endLqs());
    navigate(`/config/${lqs.value.quizId}`, { replace: true });
  }

  async function onLeave() {
    dispatch(disconnect());
    navigate("/join", { replace: true });
  }

  return (
    <div className={`h-dscreen w-full grid grid-rows-[1fr_auto] ${className}`}>
      {Children.map(children, (child) => (
        <>
          {checkNamespace(child, "content") && child}
          {checkNamespace(child, "footer") && (
            <div className="p-[0.25em] md:p-[0.75em] pl-16 xs:pl-20 md:pl-28 2xl:pl-[10dvh] w-full h-16 xs:h-20 md:h-28 2xl:h-[10dvh] bg-dune text-beige grid grid-cols-[auto_1fr] gap-[0.25em] md:gap-[0.75em] font-sans-serif">
              <div
                onClick={() => setQrExpanded((prev) => !prev)}
                className={`fixed top-0 left-0 w-full h-screen bg-dune/50 transition-all duration-500 ${
                  isQrExpanded ? "opacity-100 z-50" : "opacity-0 -z-1"
                }`}
              />
              <button
                className={`${
                  isQrExpanded
                    ? "w-3/4 sm:w-2/3 md:w-1/2 2xl:w-1/3 p-3 md:p-5 rounded-xl sm:rounded-2xl z-50 bottom-1/2 left-1/2 translate-y-1/2 -translate-x-1/2"
                    : "w-16 xs:w-20 md:w-28 2xl:w-[10dvh] p-[0.25em] md:p-[0.75em] rounded-sm bottom-0 left-0"
                } absolute overflow-hidden [&>svg>path:last-of-type]:fill-beige [&>svg>path:first-of-type]:fill-dune bg-dune transition-all duration-300 [&>svg>path:last-of-type]:transition-all [&>svg>path:first-of-type]:transition-all [&>svg>path:last-of-type]:duration-500 [&>svg>path:first-of-type]:duration-500`}
                onClick={() => setQrExpanded((prev) => !prev)}
                disabled={isQrExpanded}
              >
                <QR
                  className="w-full h-full rounded-sm"
                  value={`${import.meta.env.VITE_BASE_URL}/${code}/join`}
                  fgColor=""
                  bgColor="transparent"
                />
              </button>
              <div className="grid grid-rows-[auto_1fr] items-center justify-items-center">
                <p className="text-header-3 xs:text-header-2">&#35;{code}</p>
                {auth.value.user.isHost && (
                  <OutlinedButton
                    onClick={onCancel}
                    className="text-body-1 md:text-header-2 2xl:text-[1vw] border-beige/10 hover:bg-scarlet bg-scarlet xs:bg-transparent !border xs:border 2xl:!py-[0.5vw] 2xl:!px-[1vw] w-full self-end transition-all duration-300"
                  >
                    Cancel
                  </OutlinedButton>
                )}
                {!auth.value.user.isHost && (
                  <OutlinedButton
                    onClick={onLeave}
                    className="text-body-1 md:text-header-2 2xl:text-[1vw] border-beige/10 hover:bg-scarlet bg-scarlet xs:bg-transparent !border xs:border 2xl:!py-[0.5vw] 2xl:!px-[1vw] w-full self-end transition-all duration-300"
                  >
                    Leave
                  </OutlinedButton>
                )}
              </div>
              {child}
            </div>
          )}
        </>
      ))}
    </div>
  );
}

Layout.Content = ({ children, className }: Props) => (
  <div className={className}>{children}</div>
);
Layout.Footer = ({ children, className }: Props) => (
  <div className={className}>{children}</div>
);

function checkNamespace(
  child: any,
  namespace: string
): child is ReactElement<Props> {
  if (namespace === "content") {
    return child.type === Layout.Content;
  } else if (namespace === "footer") {
    return child.type === Layout.Footer;
  } else {
    return false;
  }
}
