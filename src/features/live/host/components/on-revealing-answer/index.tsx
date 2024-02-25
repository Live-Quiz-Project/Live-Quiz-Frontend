import { PiPersonFill } from "react-icons/pi";
import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import Layout from "@/common/layouts/Live";
import Choice from "@/features/live/host/components/on-revealing-answer/choice";

export default function OnRevealingAnswer() {
  const mod = useTypedSelector((state) => state.mod);

  return (
    <Layout>
      <Layout.Content className="overflow-auto text-dune">
        {mod.value.question!.type === "CHOICE" && <Choice />}
      </Layout.Content>
      <Layout.Footer className="flex justify-end items-center gap-[1vw] sm:gap-[0.45vw] px-[5%] 2xl:px-[2vw]">
        <PiPersonFill className="w-[1.15em] h-[1.15em] xs:w-[1.25em] xs:h-[1.25em] sm:w-[1.75em] sm:h-[1.75em]" />
        <p className="text-[0.75em] xs:text-[1.15em] md:text-[1.5em] leading-none">
          {mod.value.participantCount}
        </p>
      </Layout.Footer>
    </Layout>
  );
}
