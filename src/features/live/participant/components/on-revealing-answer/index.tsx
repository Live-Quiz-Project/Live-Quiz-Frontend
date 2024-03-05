import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import Layout from "@/common/layouts/Live";
import QuestionTypesEnum from "@/common/utils/question-types";
import Choice from "@/features/live/participant/components/on-revealing-answer/Choice";
import TrueFalse from "@/features/live/participant/components/on-revealing-answer/TrueFalse";
import FillBlank from "@/features/live/participant/components/on-revealing-answer/FillBlank";
import Paragraph from "@/features/live/participant/components/on-revealing-answer/Paragraph";
import Matching from "@/features/live/participant/components/on-revealing-answer/Matching";
import Pool from "@/features/live/participant/components/on-revealing-answer/Pool";

export default function OnRevealingAnswer() {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <Layout className="bg-egg-sour">
      <Layout.Content className="overflow-auto">
        {mod.value.question!.type === QuestionTypesEnum.CHOICE && <Choice />}
        {mod.value.question!.type === QuestionTypesEnum.TRUE_FALSE && (
          <TrueFalse />
        )}
        {mod.value.question!.type === QuestionTypesEnum.FILL_BLANK && (
          <FillBlank />
        )}
        {mod.value.question!.type === QuestionTypesEnum.PARAGRAPH && (
          <Paragraph />
        )}
        {mod.value.question!.type === QuestionTypesEnum.MATCHING && (
          <Matching />
        )}
        {mod.value.question!.type === QuestionTypesEnum.POOL && <Pool />}
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  );
}
