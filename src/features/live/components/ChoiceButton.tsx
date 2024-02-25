import {
  ChangeEvent,
  Children,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";

type ComponentProps = {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  areDetailsShown?: boolean;
  disabled?: boolean;
  value?: string;
  type?: "button" | "checkbox";
  checked?: boolean;
  children: ReactNode;
};

type ChildProps = {
  children: ReactNode;
};

export default function ChoiceButton({
  className = "",
  style,
  onChange,
  onClick,
  areDetailsShown = false,
  disabled,
  value,
  type = "button",
  checked = false,
  children,
}: ComponentProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-full h-full overflow-auto text-dune rounded-lg lg:rounded-xl 2xl:rounded-[1vw] ${
        checked ? "border-[3px] sm:border-4 border-koromiko" : "border"
      } ${className}`}
      style={style}
    >
      {Children.map(children, (child) => {
        if (checkNamespace(child, "icon")) {
          return (
            <div
              className={`${
                areDetailsShown
                  ? "top-[0.15em] sm:top-[0.4em] left-[0.25em] sm:left-[0.5em] scale-75"
                  : "top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
              } absolute transition-all duration-300 text-[1em] leading-none`}
            >
              {child}
            </div>
          );
        }
        if (checkNamespace(child, "content")) {
          return (
            <div
              className={`${
                areDetailsShown ? "opacity-100" : "opacity-0"
              } font-sans-serif text-[1em] transition-all duration-300`}
            >
              {child}
            </div>
          );
        }
        return null;
      })}
      <label
        className={`absolute top-0 left-0 w-full h-full ${
          disabled ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <input
          type={type}
          value={value}
          checked={checked}
          onClick={onClick}
          onChange={onChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
}

ChoiceButton.Icon = ({ children }: ChildProps) => <>{children}</>;

ChoiceButton.Content = ({ children }: ChildProps) => <>{children}</>;

function checkNamespace(
  child: any,
  namespace: string
): child is ReactElement<ChildProps> {
  if (namespace === "icon") {
    return child.type === ChoiceButton.Icon;
  } else {
    return child.type === ChoiceButton.Content;
  }
}
