import { Dispatch, FormEvent, SetStateAction } from "react";
import { TbSquareLetterA, TbListLetters } from "react-icons/tb";

type Props = {
  className?: string;
  areDetailsShown: boolean;
  setDetailsShown: Dispatch<SetStateAction<boolean>>;
};

export default function DetailedOptionsSwitch({
  className = "",
  areDetailsShown,
  setDetailsShown,
}: Props) {
  function onToggle(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDetailsShown(!!JSON.parse(e.currentTarget.value));
  }

  return (
    <div
      className={`${className} relative flex justify-between w-20 xs:w-24 h-8 xs:h-10 p-1  rounded-full bg-karry border`}
    >
      <span
        className={`${
          areDetailsShown ? "left-[calc(50%-1px)]" : "left-0"
        } absolute top-0 w-10 xs:w-12 h-full border-4 border-karry bg-sienna rounded-full transition-all duration-300`}
      />
      <button
        onClick={onToggle}
        type="button"
        value="false"
        className="w-8 xs:w-10 h-full z-1"
        disabled={!areDetailsShown}
      >
        <TbSquareLetterA
          className={`h-full mx-auto transition-all duration-300 ${
            areDetailsShown ? "text-dune" : "text-beige"
          }`}
        />
      </button>
      <button
        onClick={onToggle}
        type="button"
        value="true"
        className="w-8 xs:w-10 h-full z-1"
        disabled={areDetailsShown}
      >
        <TbListLetters
          className={`h-full mx-auto transition-all duration-300 ${
            areDetailsShown ? "text-beige" : "text-dune"
          }`}
        />
      </button>
    </div>
  );
}
