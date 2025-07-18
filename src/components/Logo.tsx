import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center">
      <Image alt="Logo" src="/img/logo.svg" height={28} width={28} />
      <div className="text-lg md:text-xl font-bold">Goulotech</div>
    </Link>
  );
};
