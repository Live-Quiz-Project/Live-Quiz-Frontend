import { Dispatch, SetStateAction } from "react";

type Props = {
  className?: string;
  modes: string[];
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
};

export default function ModeToggler({
  className,
  modes,
  mode,
  setMode,
}: Props) {
  return (
    <div className={`relative flex text-denim ${className}`}>
      <span
        className={`block absolute top-1/2 -translate-y-1/2 text-transparent px-[1em] py-[0.5em] border border-dune leading-tight bg-beige rounded-full w-max h-fit ${
          mode === 0 ? "left-0" : "left-full -translate-x-full"
        } transition-all duration-300`}
      >
        {modes[mode]}
      </span>
      <button
        type="button"
        className="px-[1em] w-max h-full flex items-center justify-center z-1"
        onClick={() => setMode(0)}
      >
        {modes[0]}
      </button>
      <button
        type="button"
        className="px-[1em] w-max h-full flex items-center justify-center z-1"
        onClick={() => setMode(1)}
      >
        {modes[1]}
      </button>
    </div>
  );
}
