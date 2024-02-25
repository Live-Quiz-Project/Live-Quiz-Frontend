import { Children, FormEvent, ReactElement, ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

type ComponentProps = {
  className?: string;
  init?: boolean;
  children: ReactNode;
};

type ChildProps = {
  children: ReactNode;
  className?: string;
};

export default function BaseAccordion({
  className = "",
  init = false,
  children,
}: ComponentProps) {
  const [isExpanded, setExpanded] = useState<boolean>(init);

  function onToggle(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setExpanded((prev) => !prev);
  }

  return (
    <div className={className}>
      {Children.map(children, (child) => {
        if (checkNamespace(child, "head")) {
          return (
            <button
              onClick={onToggle}
              className="relative flex h-fit items-center justify-center overflow-hidden w-full gap-4 leading-tight"
            >
              {child}
              <FaChevronDown
                className={`absolute top-1/2 -translate-y-1/2 right-0 transition-all duration-300 h-2 min-h-4 w-2 min-w-4 ${
                  isExpanded && "rotate-180"
                }`}
              />
            </button>
          );
        }
        if (checkNamespace(child, "body")) {
          return (
            <div
              className={`grid transition-all duration-300 ${
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">{child}</div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

BaseAccordion.Head = ({ children, className }: ChildProps) => (
  <div className={className}>{children}</div>
);

BaseAccordion.Body = ({ children, className }: ChildProps) => (
  <div className={className}>{children}</div>
);

function checkNamespace(
  child: any,
  namespace: string
): child is ReactElement<ChildProps> {
  if (namespace === "head") {
    return child.type === BaseAccordion.Head;
  } else {
    return child.type === BaseAccordion.Body;
  }
}
