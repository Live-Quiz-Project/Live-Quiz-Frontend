import { FormEvent } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
};

export default function LabeledInput({ label, value, onChange }: Props) {
  return (
    <label className="relative">
      <span className="">{label}</span>
      <input
        value={value}
        onChange={onChange}
        className="bg-egg-sour text-black"
      />
    </label>
  );
}
