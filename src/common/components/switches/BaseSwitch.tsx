import { Dispatch, FormEvent } from "react";

type Props = {
  className?: string;
  checked: boolean;
  setChecked: Dispatch<React.SetStateAction<any>>;
};

export default function BaseSwitch({
  className = "",
  checked,
  setChecked,
}: Props) {
  function onSwitch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setChecked((prev: boolean) => !prev);
  }

  return (
    <button
      onClick={onSwitch}
      className={`relative h-10 aspect-[2/1] rounded-full transition-all duration-300 ${
        checked ? "bg-koromiko" : "bg-quill-gray"
      } ${className}`}
    >
      <span
        className={`absolute top-0 block border-2 bg-white h-full rounded-full aspect-square transition-all duration-300 ${
          checked
            ? "left-full -translate-x-full border-koromiko"
            : "left-0 translate-x-0 border-quill-gray"
        }`}
      />
    </button>
  );
}
