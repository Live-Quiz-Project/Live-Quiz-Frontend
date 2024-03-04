import { useTypedSelector } from "@/common/hooks/useTypedSelector";

export default function Loading() {
  const auth = useTypedSelector((state) => state.auth);

  return (
    <div
      className={`w-screen h-dvh flex justify-center items-center ${
        auth.value.user.isHost ? "bg-jordy-blue" : "bg-koromiko"
      }`}
    >
      <span
        className={`animate-[spin_3s_linear_infinite] w-10 h-10 border-8 border-dotted rounded-full ${
          auth.value.user.isHost ? "border-white" : "border-dune"
        }`}
      />
    </div>
  );
}
