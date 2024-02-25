import { FormEvent, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  value?: string;
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
};

export default function FilledButton(props: Props) {
  return (
    <button
      {...props}
      className={`px-4 md:px-5 py-2 xs:py-3 leading-none rounded-full disabled:bg-quill-gray ${props.className}`}
    >
      {props.children}
    </button>
  );
}
