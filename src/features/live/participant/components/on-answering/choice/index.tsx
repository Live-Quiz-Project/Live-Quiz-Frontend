import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { Dispatch, SetStateAction } from "react";
import Unanswered from "@/features/live/participant/components/on-answering/choice/Unanswered";
import Answered from "@/features/live/participant/components/on-answering/choice/Answered";

type Props = {
  onSubmit: () => void;
  selectedOptions: ChoiceOption[];
  setSelectedOptions: Dispatch<SetStateAction<ChoiceOption[]>>;
  invalidAmountOfOptions: boolean;
};

export default function index({
  onSubmit,
  selectedOptions,
  setSelectedOptions,
  invalidAmountOfOptions,
}: Props) {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <>
      {(!mod.value.answers ||
        (mod.value.answers && mod.value.answers.length) <= 0) && (
        <Unanswered
          onSubmit={onSubmit}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          invalidAmountOfOptions={invalidAmountOfOptions}
        />
      )}
      {mod.value.answers && mod.value.answers.length > 0 && <Answered />}
    </>
  );
}
