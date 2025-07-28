import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center">
      <Image alt="Logo" src="/img/logo.svg" height={22} width={22} className="w-auto" />
      <div className="text-lg md:text-md font-bold">Goulotech</div>
    </Link>
  );
};
