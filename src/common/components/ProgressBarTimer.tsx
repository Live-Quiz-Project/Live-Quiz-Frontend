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
          transition: "width 500ms linear",
        }}
      >
        <span className="absolute right-0 inline-flex items-center justify-center w-8 h-8 xs:w-12 xs:h-12 2xl:w-[2.5vw] 2xl:h-[2.5vw] text-beige translate-x-1/2 -translate-y-1/2 rounded-full text-header-1 2xl:text-[1.25vw] font-sans-serif top-1/2 bg-sienna">
          {Math.ceil(timeLeft + 0.5) > maxTime
            ? maxTime
            : Math.ceil(timeLeft + 0.5)}
        </span>
      </div>
    </div>
  );
}
