import {
  CSSProperties,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

type Props = {
  className?: string;
  id?: string;
  style?: CSSProperties;
  value?: string;
  onKeyPress?: (e: KeyboardEvent<HTMLSpanElement>) => void;
  onChange?: (e: ChangeEvent<HTMLSpanElement>) => void;
  onFocus?: (e: FocusEvent<HTMLSpanElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSpanElement>) => void;
  truncate?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export default function EditableLabel({
  className = "",
  id,
  style,
  value = "",
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  truncate = false,
  placeholder = "",
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.textContent = value;
    }
  }, [value]);

  return (
    <div
      className={`overflow-hidden inline-block relative ${className}`}
      style={style}
    >
      <span
        ref={inputRef}
        id={id}
        contentEditable={!disabled}
        onFocus={(e) => {
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          onBlur && onBlur(e);
        }}
        onInput={onChange}
        onKeyUp={onKeyPress}
        onKeyDown={onKeyPress}
        className={`align-middle items-center leading-snug rounded-lg border-koromiko transition-all duration-300 [&:focus]:border-2 [&:focus]:border-dashed border-none w-auto ${
          truncate
            ? "inline-block overflow-hidden whitespace-nowrap [&:not(:focus)]:w-full [&:not(:focus)]:text-ellipsis"
            : "block"
        } ${disabled ? "opacity-50" : "opacity-100"}`}
        data-placeholder={placeholder}
        role="textbox"
        autoFocus
      />
    </div>
  );
}
