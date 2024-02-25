import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import Layout from "@/common/layouts/Live";
import QuestionTypesEnum from "@/common/utils/question-types";
import Choice from "@/features/live/participant/components/on-revealing-answer/Choice";

export default function OnRevealingAnswer() {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <Layout>
      <Layout.Content>
        {mod.value.question!.type === QuestionTypesEnum.CHOICE && <Choice />}
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  );
}
