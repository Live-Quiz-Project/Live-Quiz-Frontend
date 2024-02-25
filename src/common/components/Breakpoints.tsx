export default function Breakpoints() {
  return (
    <div className="fixed top-0 right-0 w-10 h-10 bg-white text-black border rounded-full flex items-center justify-center">
      <p className="inline sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        xs
      </p>
      <p className="hidden sm:inline md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </p>
      <p className="hidden sm:hidden md:inline lg:hidden xl:hidden 2xl:hidden">
        md
      </p>
      <p className="hidden sm:hidden md:hidden lg:inline xl:hidden 2xl:hidden">
        lg
      </p>
      <p className="hidden sm:hidden md:hidden lg:hidden xl:inline 2xl:hidden">
        xl
      </p>
      <p className="hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:inline">
        2xl
      </p>
    </div>
  );
}
