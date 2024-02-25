import logo from "@/common/assets/logo-alt.png";

export default function OnIncluding() {
  return (
    <div className="bg-beige h-dscreen p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pb-0 grid grid-rows-[auto_1fr] justify-items-center md:justify-items-start overflow-hidden">
      <img src={logo} alt="logo" className="w-44 xs:w-52 2xl:w-[12vw]" />
      <div className="-ml-[3vw] w-full h-full flex justify-center items-end space-x-[1vw] 2xl:space-x-[1.5vw]">
        <div className="relative w-[30%] h-[65%] 2xl:w-[25%] bg-koromiko rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw]">
          <div className="absolute bottom-0 left-full h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] w-96 border-t-[15vw] border-t-transparent border-l-[6vw] border-l-dune" />
        </div>
        <div className="relative w-[40%] h-[75%] 2xl:w-[35%] bg-sienna rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw]">
          <div className="absolute bottom-0 left-full h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] w-96 border-t-[15vw] border-t-transparent border-l-[6vw] border-l-dune" />
        </div>
        <div className="relative w-[25%] h-[60%] 2xl:w-[20%] bg-karry rounded-t-lg xs:rounded-t-xl md:rounded-t-2xl xl:rounded-t-3xl 2xl:rounded-t-[1vw]">
          <div className="absolute bottom-0 left-full h-[calc(100%-0.5rem)] xs:h-[calc(100%-0.75rem)] md:h-[calc(100%-1rem)] xl:h-[calc(100%-1.5rem)] 2xl:h-[calc(100%-1vw)] w-96 border-t-[15vw] border-t-transparent border-l-[6vw] border-l-dune" />
        </div>
      </div>
    </div>
  );
}
