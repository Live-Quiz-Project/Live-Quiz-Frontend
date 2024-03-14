type Props = {
  className?: string;
  maxTime: number;
  timeLeft: number;
};

export default function ProgressBarTimer({
  className = "",
  maxTime,
  timeLeft,
}: Props) {
  return (
    <div className={`p-1 rounded-full bg-quill-gray/20 w-full ${className}`}>
      <div
        className="relative h-1.5 xs:h-4 rounded-full bg-koromiko"
        style={{
          width: `${(timeLeft / maxTime) * 100}%`,
          transition: "width 100ms linear",
        }}
      >
        <span className="absolute right-0 inline-flex items-center justify-center min-w-8 min-h-8 xs:min-w-12 xs:min-h-12 2xl:min-w-[2.5vw] 2xl:min-h-[2.5vw] px-3 w-max text-beige translate-x-1/2 -translate-y-1/2 rounded-full text-header-1 2xl:text-[1.25vw] font-sans-serif top-1/2 bg-sienna">
          {timeLeft <= 60
            ? Math.ceil(timeLeft + 0.5) > maxTime
              ? maxTime
              : Math.ceil(timeLeft + 0.5)
            : `${Math.floor((timeLeft + 0.1) / 60)
                .toString()
                .padStart(2, "0")}:${Math.ceil((timeLeft + 0.1) % 60)
                .toString()
                .padStart(2, "0")}`}
        </span>
      </div>
    </div>
  );
}
