import { CSSProperties, FocusEventHandler, FormEvent } from "react";

type Props = {
  className?: string;
  id?: string;
  style?: CSSProperties;
  value?: string;
  onChange?: (e: FormEvent<HTMLTextAreaElement>) => void;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  cols?: number;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
};

export default function BaseTextarea(props: Props) {
  return (
    <textarea
      {...props}
      className={`w-full h-20 xl:h-24 resize-none text-body-1 text-left px-3 xl:px-4 py-1.5 xl:py-3 border-regent-gray rounded-xl disabled:text-regent-gray leading-tight ${props.className}`}
      cols={props.cols || 30}
      rows={props.rows || 10}
    />
  );
}
