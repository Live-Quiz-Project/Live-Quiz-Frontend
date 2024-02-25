type Props = {
  className?: string;
  timeLeft: number;
};

export default function NumberedTimer({ className = "", timeLeft }: Props) {
  return (
    <div
      className={`flex items-center justify-center px-[0.5em] py-[0.3em] text-dune rounded-xl bg-koromiko font-sans-serif tracking-wide text-header-1 2xl:text-[1.25vw] outline outline-4 outline-sienna -outline-offset-[6px] ${className}`}
    >
      {`${Math.floor((timeLeft + 0.5) / 60)
        .toString()
        .padStart(2, "0")}:${Math.ceil((timeLeft + 0.5) % 60)
        .toString()
        .padStart(2, "0")}`}
    </div>
  );
}
