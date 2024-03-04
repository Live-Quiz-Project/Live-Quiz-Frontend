import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Main from "@/features/live/host/components/on-answering/pool/Main";
import Subquestions from "@/features/live/host/components/on-answering/pool/Subquestions";

type Props = {
  curSubQ: number;
  setCurSubQ: Dispatch<SetStateAction<number>>;
};

export default function Pool({ curSubQ, setCurSubQ }: Props) {
  const [cur, setCur] = useState<number>(curSubQ);

  function onSelectSubQ(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurSubQ(cur);
  }

  return (
    <div className="flex-1 flex w-full h-full">
      {curSubQ < 0 && <Main setCurSubQ={setCur} onSubmit={onSelectSubQ} />}
      {curSubQ >= 0 && (
        <Subquestions curSubQ={curSubQ} setCurSubQ={setCurSubQ} />
      )}
    </div>
  );
}
