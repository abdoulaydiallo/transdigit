import Image from "next/image";

type Props = {
  src: string;
  name: string;
};

export const CardTool = ({ src, name }: Props) => {
  return (
    <div className="flex items-center gap-2 py-2 px-4 rounded-sm shadow-md">
      <Image alt="Icon" src={src} width={28} height={28} />
      <p className="text-xs">{name}</p>
    </div>
  );
};
