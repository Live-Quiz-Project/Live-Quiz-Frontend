import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Emoji from "@/common/utils/emojis";
import EditableLabel from "@/common/components/inputs/EditableLabel";

type Props = {
  className?: string;
  displayName: string;
  displayColor: string;
  displayEmoji: string;
  onDisplayNameChange: (e: ChangeEvent<HTMLSpanElement>) => void;
  onDisplayColorChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDisplayEmojiChange: (e: FormEvent<HTMLButtonElement>) => void;
};

export default function CustomUserCard({
  className = "",
  displayName,
  displayColor,
  displayEmoji,
  onDisplayNameChange,
  onDisplayColorChange,
  onDisplayEmojiChange,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setEditing(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <div
      className={`text-header-1 space-x-4 p-1.5 pr-6 h-fit flex items-center font-light rounded-full bg-egg-sour font-sans-serif text-dune ${className}`}
    >
      <div
        className="min-w-16 h-16 flex items-center justify-center rounded-full cursor-pointer leading-none text-header-1"
        onClick={() => setEditing(true)}
        style={{ backgroundColor: displayColor }}
      >
        {Emoji.find((e) => e.value === displayEmoji)?.label || Emoji[0].label}
      </div>
      <EditableLabel
        value={displayName}
        onChange={onDisplayNameChange}
        className="px-2 border-2 border-dashed border-koromiko rounded-lg"
        placeholder="Enter your name..."
        truncate
      />
      {isEditing && (
        <div className="w-full h-full fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-50 !m-0 flex justify-center items-center">
          <div
            ref={editorRef}
            className="w-full xs:w-11/12 sm:w-3/5 lg:w-2/5 p-1 xs:p-2 md:p-4 xl:p-6 space-y-2 sm:space-y-4 xl:space-y-6 backdrop-blur-xl rounded-xl md:rounded-3xl"
            style={{ backgroundColor: displayColor + "88" }}
          >
            <label
              className="block w-[calc(100%-0.5rem)] xs:w-full h-12 md:h-16 rounded-xl mx-1 mt-1 xs:m-0"
              style={{ backgroundColor: displayColor }}
            >
              <input
                className="opacity-0 w-full h-full cursor-pointer"
                type="color"
                value={displayColor}
                onChange={onDisplayColorChange}
              />
            </label>
            <div className="grid grid-cols-10 gap-0.5 xs:gap-1 md:gap-2 2xl:gap-4">
              {Emoji.map((emoji, i) => (
                <button
                  key={i}
                  value={emoji.value}
                  className="p-px"
                  onClick={(e) => {
                    onDisplayEmojiChange(e);
                    setEditing(false);
                  }}
                >
                  {Emoji[i].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
