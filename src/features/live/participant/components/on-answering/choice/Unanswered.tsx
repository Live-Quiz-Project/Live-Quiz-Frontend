import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import { MathJax } from "better-react-mathjax";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ChoiceButton from "@/features/live/components/ChoiceButton";
import DetailedOptionsSwitch from "@/features/live/participant/components/DetailedOptionsSwitch";

type Props = {
  onSubmit: (
    e?: FormEvent<HTMLInputElement | HTMLButtonElement>,
    opt?: ChoiceOption[]
  ) => void;
  selectedOptions: ChoiceOption[];
  setSelectedOptions: Dispatch<SetStateAction<ChoiceOption[]>>;
  invalidAmountOfOptions: boolean;
};

export default function Unanswered({
  onSubmit,
  selectedOptions,
  setSelectedOptions,
  invalidAmountOfOptions,
}: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [options, setOptions] = useState<ChoiceOption[]>([]);
  const [areDetailsShown, setDetailsShown] = useState<boolean>(false);
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const optionsContainerGridFormat =
    mod.value.question!.layout === 0
      ? `${
          (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "grid-rows-3"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "grid-rows-4"
            : "grid-rows-10"
        } grid-flow-col auto-cols-fr auto-cols ${
          (mod.value.question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:row-start-5"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:row-start-4"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:row-start-3"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:row-start-2"
            : null
        }`
      : mod.value.question!.layout === 1
      ? `grid-cols-4 auto-rows-fr ${
          (mod.value.question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:col-start-2"
            : ""
        }`
      : mod.value.question!.layout === 2
      ? `grid-rows-4 grid-flow-col auto-cols-fr auto-cols ${
          (mod.value.question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:row-start-2"
            : ""
        }`
      : `${
          (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "grid-cols-3"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "grid-cols-4"
            : "grid-cols-10"
        } auto-rows-fr ${
          (mod.value.question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:col-start-5"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:col-start-4"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:col-start-3"
            : (mod.value.question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:col-start-2"
            : null
        }`;
  const choiceButtonGridFormat =
    mod.value.question!.layout === 0
      ? `${
          (mod.value.question!.options as ChoiceOption[]).length === 1
            ? "row-span-10 !row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 2
            ? "row-span-5 first:!row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 3
            ? "row-span-1 first:!row-start-1"
            : (mod.value.question!.options as ChoiceOption[]).length === 4
            ? "row-span-1 first:!row-start-1"
            : "row-span-2"
        }`
      : mod.value.question!.layout === 1
      ? (mod.value.question!.options as ChoiceOption[]).length === 1
        ? "col-span-4 !col-start-1"
        : "col-span-2"
      : mod.value.question!.layout === 2
      ? (mod.value.question!.options as ChoiceOption[]).length === 1
        ? "row-span-4 !row-start-1"
        : "row-span-2"
      : (mod.value.question!.options as ChoiceOption[]).length === 1
      ? "col-span-10 !col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 2
      ? "col-span-5 first:!col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 3
      ? "col-span-1 first:!col-start-1"
      : (mod.value.question!.options as ChoiceOption[]).length === 4
      ? "col-span-1 first:!col-start-1"
      : "col-span-2";

  useEffect(() => {
    if (mod.value.config.shuffle.option) {
      setDetailsShown(true);
      setOptions(
        (mod.value.question!.options as ChoiceOption[])
          .slice()
          .sort(() => Math.random() - 0.5)
      );
    } else {
      setOptions(mod.value.question!.options as ChoiceOption[]);
    }
  }, []);

  function onSelect(e: FormEvent<HTMLInputElement>, option: ChoiceOption) {
    e.preventDefault();
    setSelectedOptions((prev) => {
      if (prev.map((o) => o.id).includes(option.id)) {
        return prev.filter((o) => o.id !== option.id);
      }
      return prev.concat([option]);
    });
  }

  return (
    <div
      className={`flex-1 grid gap-2 sm:gap-4 2xl:gap-[3vw] overflow-auto ${
        isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      <div
        className={`relative grid items-start gap-x-[1em] h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 grid-rows-[1fr_auto] ${
          isQuestionExpanded
            ? "grid-cols-[1fr_0fr_0fr]"
            : "grid-cols-[1fr_0fr_auto]"
        }`}
      >
        {!isNoteExpanded && (
          <button
            type="button"
            onClick={() => setQuestionExpanded((prev) => !prev)}
            className={`grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[2.75em] max-h-full ${
              isQuestionExpanded
                ? "col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            }`}
          >
            <div className="flex items-center h-[2.75em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
                ?
              </p>
            </div>
            <MathJax
              className={`text-left text-[1.75em] w-full leading-tight ${
                isQuestionExpanded ? "pt-[0.15em]" : "truncate"
              }`}
            >
              {mod.value.question!.content}
            </MathJax>
          </button>
        )}
        {!isQuestionExpanded && !isNoteExpanded && (
          <div className="flex items-center h-full">
            <DetailedOptionsSwitch
              areDetailsShown={areDetailsShown}
              setDetailsShown={setDetailsShown}
            />
          </div>
        )}
        {!isQuestionExpanded && (
          <button
            type="button"
            onClick={() => {
              setNoteExpanded((prev) => !prev);
              setNoteFirstOpened(false);
            }}
            className={`grid gap-[1em] font-serif min-h-[2.75em] max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "grid-cols-1 items-center"
            }`}
          >
            {isNoteExpanded && (
              <MathJax className="text-left text-[1.75em] w-full leading-tight">
                {mod.value.question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-[2.75em] text-sienna flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="w-full h-[2em]" />
              ) : (
                <AiOutlineMessage className="w-full h-[2em]" />
              )}
              {mod.value.question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        )}
        {mod.value.question!.selectMax > 1 && (
          <p
            className={
              invalidAmountOfOptions
                ? "text-scarlet animate-bounce"
                : "text-dune"
            }
          >
            &#42;&nbsp;Select at least&nbsp;
            {mod.value.question!.selectMin}
            &nbsp;and up to&nbsp;
            {mod.value.question!.selectMax}
            &nbsp;choices
          </p>
        )}
      </div>
      <div className="w-full h-full overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0">
        <div
          className={`grid justify-items-center h-full w-full gap-2 sm:gap-4 2xl:gap-[1vw] tracking-tight ${optionsContainerGridFormat}`}
        >
          {options.map((option, i) => (
            <ChoiceButton
              key={option.id}
              type={mod.value.question!.selectMax > 1 ? "checkbox" : "button"}
              className={`text-[1.25em] p-2 sm:p-4 2xl:p-[0.6em] ${choiceButtonGridFormat}`}
              style={{
                backgroundColor: mod.value.config.option.colorless
                  ? "#faf7ee"
                  : option.color,
              }}
              value={option.id}
              checked={
                mod.value.question!.selectMax > 1
                  ? selectedOptions.map((o) => o.id).includes(option.id)
                  : undefined
              }
              onChange={
                mod.value.question!.selectMax > 1
                  ? (e) => onSelect(e, option)
                  : () => {}
              }
              onClick={
                mod.value.question!.selectMax > 1
                  ? () => {}
                  : (e) => {
                      onSubmit(e, [option]);
                    }
              }
              areDetailsShown={areDetailsShown}
              disabled={
                selectedOptions.length >= mod.value.question!.selectMax &&
                !selectedOptions.map((o) => o.id).includes(option.id)
              }
            >
              <ChoiceButton.Icon>
                <p className="font-light">{String.fromCharCode(65 + i)}&#46;</p>
              </ChoiceButton.Icon>
              <ChoiceButton.Content>{option.content}</ChoiceButton.Content>
            </ChoiceButton>
          ))}
        </div>
      </div>
    </div>
  );
}
