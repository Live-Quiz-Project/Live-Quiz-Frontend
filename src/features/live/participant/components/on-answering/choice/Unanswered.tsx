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
import DetailedOptionsSwitch from "@/features/live/participant/components/on-answering/DetailedOptionsSwitch";
import FilledButton from "@/common/components/buttons/FilledButton";

type Props = {
  onSubmit: (
    e?: FormEvent<HTMLInputElement | HTMLButtonElement>,
    opt?: ChoiceOption[]
  ) => void;
  selectedOptions: ChoiceOption[];
  setSelectedOptions: Dispatch<SetStateAction<ChoiceOption[]>>;
  invalidAmountOfOptions: boolean;
  required?: boolean;
  q?: Question;
};

export default function Unanswered({
  onSubmit,
  selectedOptions,
  setSelectedOptions,
  invalidAmountOfOptions,
  required,
  q,
}: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const [question, setQuestion] = useState<Question>(
    q ? q : mod.value.question!
  );
  const [options, setOptions] = useState<ChoiceOption[]>([]);
  const [areDetailsShown, setDetailsShown] = useState<boolean>(false);
  const [isQuestionExpanded, setQuestionExpanded] = useState<boolean>(false);
  const [isNoteExpanded, setNoteExpanded] = useState<boolean>(false);
  const [isNoteFirstOpened, setNoteFirstOpened] = useState<boolean>(true);
  const optionsContainerGridFormat =
    question!.layout === 0
      ? `${
          (question!.options as ChoiceOption[]).length === 3
            ? "grid-rows-3"
            : (question!.options as ChoiceOption[]).length === 4
            ? "grid-rows-4"
            : "grid-rows-10"
        } grid-flow-col auto-cols-fr auto-cols ${
          (question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:row-start-5"
            : (question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:row-start-4"
            : (question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:row-start-3"
            : (question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:row-start-2"
            : null
        }`
      : question!.layout === 1
      ? `grid-cols-4 auto-rows-fr ${
          (question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:col-start-2"
            : ""
        }`
      : question!.layout === 2
      ? `grid-rows-4 grid-flow-col auto-cols-fr auto-cols ${
          (question!.options as ChoiceOption[]).length % 2 === 1
            ? "[&>*:nth-last-child(1)]:row-start-2"
            : ""
        }`
      : `${
          (question!.options as ChoiceOption[]).length === 3
            ? "grid-cols-3"
            : (question!.options as ChoiceOption[]).length === 4
            ? "grid-cols-4"
            : "grid-cols-10"
        } auto-rows-fr ${
          (question!.options as ChoiceOption[]).length % 5 === 1
            ? "[&>*:nth-last-child(1)]:col-start-5"
            : (question!.options as ChoiceOption[]).length % 5 === 2
            ? "[&>*:nth-last-child(2)]:col-start-4"
            : (question!.options as ChoiceOption[]).length % 5 === 3
            ? "[&>*:nth-last-child(3)]:col-start-3"
            : (question!.options as ChoiceOption[]).length % 5 === 4
            ? "[&>*:nth-last-child(4)]:col-start-2"
            : null
        }`;
  const choiceButtonGridFormat =
    question!.layout === 0
      ? `${
          (question!.options as ChoiceOption[]).length === 1
            ? "row-span-10 !row-start-1"
            : (question!.options as ChoiceOption[]).length === 2
            ? "row-span-5 first:!row-start-1"
            : (question!.options as ChoiceOption[]).length === 3
            ? "row-span-1 first:!row-start-1"
            : (question!.options as ChoiceOption[]).length === 4
            ? "row-span-1 first:!row-start-1"
            : "row-span-2"
        }`
      : question!.layout === 1
      ? (question!.options as ChoiceOption[]).length === 1
        ? "col-span-4 !col-start-1"
        : "col-span-2"
      : question!.layout === 2
      ? (question!.options as ChoiceOption[]).length === 1
        ? "row-span-4 !row-start-1"
        : "row-span-2"
      : (question!.options as ChoiceOption[]).length === 1
      ? "col-span-10 !col-start-1"
      : (question!.options as ChoiceOption[]).length === 2
      ? "col-span-5 first:!col-start-1"
      : (question!.options as ChoiceOption[]).length === 3
      ? "col-span-1 first:!col-start-1"
      : (question!.options as ChoiceOption[]).length === 4
      ? "col-span-1 first:!col-start-1"
      : "col-span-2";

  useEffect(() => {
    if (mod.value.config.shuffle.option) {
      setDetailsShown(true);
      setOptions(
        (question!.options as ChoiceOption[])
          .slice()
          .sort(() => Math.random() - 0.5)
      );
    } else {
      setOptions(question!.options as ChoiceOption[]);
    }
  }, []);

  useEffect(() => {
    if (q) {
      setQuestion(q);
    } else {
      setQuestion(mod.value.question!);
    }
  }, [q]);

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
      className={`relative flex-1 grid gap-2 sm:gap-4 2xl:gap-[1vw] overflow-auto ${
        isQuestionExpanded || isNoteExpanded
          ? "grid-rows-2"
          : "grid-rows-[auto_1fr]"
      } ${q ? "bg-koromiko/25" : ""}`}
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
            className={`group relative grid grid-cols-[auto_1fr] gap-[1em] font-serif min-h-[3em] max-h-full ${
              isQuestionExpanded
                ? "col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "items-center"
            }`}
          >
            <span className="opacity-0 group-hover:opacity-100 absolute w-full h-full bg-beige rounded-full blur-lg transition-all duration-300" />
            <div className="flex items-center h-[3em] font-serif">
              <p className="translate-x-1/4 text-[2.25em] !-rotate-[25deg] text-sienna">
                ?
              </p>
            </div>
            <MathJax
              className={`z-1 h-full tracking-tight font-medium text-left text-[1.75em] w-full ${
                isQuestionExpanded
                  ? "pt-[0.1em] leading-normal"
                  : "truncate leading-[1.75]"
              }`}
            >
              {question!.content}
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
            className={`group grid gap-[1em] font-serif min-h-[3em] max-h-full ${
              isNoteExpanded
                ? "grid-cols-[1fr_auto] col-span-3 h-full bg-beige items-start outline outline-1 -m-[1em] xs:-my-[1em] xs:-mx-[1.25em] p-[1em] xs:py-[1em] xs:px-[1.25em] rounded-md sm:rounded-lg lg:rounded-xl 2xl:rounded-[1vw] z-1 overflow-auto"
                : "grid-cols-1 items-center"
            }`}
          >
            {isNoteExpanded && (
              <MathJax
                className={`h-full tracking-tight font-medium text-left text-[1.75em] w-full ${
                  isNoteExpanded
                    ? "pt-[0.1em] leading-normal"
                    : "truncate leading-[1.75]"
                }`}
              >
                {question!.note}
              </MathJax>
            )}
            <div className="relative w-[2em] h-[3em] text-sienna flex items-center">
              {isNoteExpanded ? (
                <AiFillMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              ) : (
                <AiOutlineMessage className="group-hover:scale-110 w-full h-[2em] transition-all duration-200" />
              )}
              {question!.note !== "" && isNoteFirstOpened && (
                <span className="absolute block !p-0 top-1 -right-1 w-4 h-4 rounded-full bg-scarlet" />
              )}
            </div>
          </button>
        )}
        {required ? (
          <p className="col-span-3 text-scarlet animate-bounce">
            &#42;&nbsp;This question is required to get to the next one.
          </p>
        ) : (
          question!.selectMax > 1 && (
            <p
              className={`col-span-3 ${
                invalidAmountOfOptions
                  ? "text-scarlet animate-bounce"
                  : "text-dune"
              }`}
            >
              &#42;&nbsp;
              {question!.selectMax === question!.selectMin
                ? `Select exactly ${question!.selectMax} choices`
                : `Select at least ${question!.selectMin} and up to ${
                    question!.selectMax
                  } choices`}
            </p>
          )
        )}
      </div>
      <div
        className={`w-full h-full overflow-auto p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 grid justify-items-center gap-2 sm:gap-4 2xl:gap-[1vw] tracking-tight ${optionsContainerGridFormat}`}
      >
        {options.map((option, i) => (
          <ChoiceButton
            key={option.id}
            type={question!.selectMax > 1 ? "checkbox" : "button"}
            className={`text-[1.25em] p-2 sm:p-4 2xl:p-[0.6em] ${choiceButtonGridFormat}`}
            style={{
              backgroundColor: mod.value.config.option.colorless
                ? "#faf7ee"
                : option.color,
            }}
            value={option.id}
            checked={
              question!.selectMax > 1
                ? selectedOptions.map((o) => o.id).includes(option.id)
                : undefined
            }
            onChange={
              question!.selectMax > 1 ? (e) => onSelect(e, option) : () => {}
            }
            onClick={
              question!.selectMax > 1
                ? () => {}
                : (e) => {
                    onSubmit(e, [option]);
                  }
            }
            areDetailsShown={areDetailsShown}
            disabled={
              selectedOptions.length >= question!.selectMax &&
              !selectedOptions.map((o) => o.id).includes(option.id)
            }
          >
            <ChoiceButton.Icon>
              <p className="text-[1em] font-light">
                {String.fromCharCode(65 + i)}&#46;
              </p>
            </ChoiceButton.Icon>
            <ChoiceButton.Content>
              <MathJax className="text-[1em] tracking-tight font-medium">
                {option.content}
              </MathJax>
            </ChoiceButton.Content>
          </ChoiceButton>
        ))}
      </div>
      {q && onSubmit && (
        <FilledButton
          className="absolute bottom-0 right-0 rounded-none rounded-tl-3xl bg-dune text-beige text-body-1 md:text-header-2 2xl:text-[1vw] h-fit"
          onClick={onSubmit}
        >
          Submit
        </FilledButton>
      )}
    </div>
  );
}
