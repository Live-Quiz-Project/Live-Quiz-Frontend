import Emoji from "@/common/utils/emojis";

type Props = {
  className?: string;
  size: "sm" | "md" | "lg";
  user: {
    displayName: string;
    displayEmoji: string;
    displayColor: string;
  };
};

export default function UserCard({ className = "", user, size }: Props) {
  return (
    <div
      className={`${size === "sm" ? "text-header-2 p-1 h-16" : ""}${
        size === "md" ? "text-header-1 p-1.5 h-20" : ""
      }${
        size === "lg" ? "text-subtitle p-2 h-24" : ""
      } w-fit grid grid-cols-[auto_1fr] items-center rounded-full bg-egg-sour font-sans-serif text-dune transition-all duration-300 ${className}`}
    >
      <div
        className="min-h-full aspect-square flex items-center justify-center rounded-full"
        style={{ backgroundColor: user.displayColor }}
      >
        {Emoji.find((e) => e.value === user.displayEmoji)?.label ||
          Emoji[0].label}
      </div>
      <p className="pl-[0.6em] pr-[0.7em] truncate">{user.displayName}</p>
    </div>
  );
}
