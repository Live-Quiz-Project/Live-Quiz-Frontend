import { FormEvent } from "react";

type Props = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
  className?: string;
};

export default function OulinedButton({
  children = "",
  type,
  onClick,
  className,
}: Props) {
  return (
    <button
      className={`px-4 md:px-5 py-2 xs:py-3 leading-none rounded-full border ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
