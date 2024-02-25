import { useState } from "react";
import Answers from "@/features/live/host/components/on-revealing-answer/choice/Answers";
import Correct from "@/features/live/host/components/on-revealing-answer/choice/Correct";
import Leaderboard from "@/features/live/host/components/on-revealing-answer/Leaderboard";

export default function Choice() {
  const [mode, setMode] = useState<number>(0);

  return (
    <>
      {mode === 0 && <Answers setMode={setMode} />}
      {mode === 1 && <Correct setMode={setMode} />}
      {mode === 2 && <Leaderboard setMode={setMode} />}
    </>
  );
}
