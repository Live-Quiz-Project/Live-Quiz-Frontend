import { Dispatch, FormEvent, SetStateAction } from "react";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { FaSpellCheck } from "react-icons/fa6";

type Props = {
  className?: string;
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
};

export default function ModeToggler({ className = "", mode, setMode }: Props) {
  function onToggle(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMode(+e.currentTarget.value);
  }

  return (
    <div
      className={`${className} relative flex justify-between w-20 xs:w-24 h-8 xs:h-10 p-1  rounded-full bg-jordy-blue border`}
    >
      <span
        className={`${
          mode ? "left-[calc(50%-1px)]" : "left-0"
        } absolute top-0 w-10 xs:w-12 h-full border-4 border-jordy-blue bg-denim rounded-full transition-all duration-300`}
      />
      <button
        onClick={onToggle}
        type="button"
        value="0"
        className="w-8 xs:w-10 h-full z-1"
      >
        <PiChartBarHorizontalFill
          className={`h-full mx-auto transition-all duration-300 ${
            mode ? "text-dune" : "text-beige"
          }`}
        />
      </button>
      <button
        onClick={onToggle}
        type="button"
        value="1"
        className="w-8 xs:w-10 h-full z-1"
      >
        <FaSpellCheck
          className={`h-full mx-auto transition-all duration-300 ${
            mode ? "text-beige" : "text-dune"
          }`}
        />
      </button>
    </div>
  );
}
