import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";

type Props = {
  className?: string;
  setOpen: Dispatch<SetStateAction<any>>;
  children: ReactNode;
};

export default function BaseModal({ className, setOpen, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const checkOverflow = () => {
      if (modalRef.current) {
        const spaceBelow =
          window.innerHeight - modalRef.current.getBoundingClientRect().bottom;
        const spaceAbove = modalRef.current.getBoundingClientRect().top;
        if (spaceAbove > spaceBelow) {
          modalRef.current.style.top = `-${modalRef.current.clientHeight}px`;
        } else {
          modalRef.current.style.top = "";
        }
      }
    };
    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("resize", checkOverflow);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [modalRef, setOpen]);

  return (
    <div className="fixed top-0 left-0 z-10 flex justify-center items-center w-screen h-dscreen bg-black/50 backdrop-blur-sm">
      <div className="container px-2">
        <div
          ref={modalRef}
          className={`w-fit mx-auto bg-white px-16 py-10 rounded-lg ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
