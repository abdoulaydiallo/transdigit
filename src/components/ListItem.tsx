import Image from "next/image";

type Props = {
  title: string;
};

export const ListItem = ({ title }: Props) => {
  return (
    <div className="flex items-start md:items-center">
      <Image alt="Check" src="/img/check-red.svg" width={14} height={14} />
      <p className="ml-2 text-sm font-semibold text-black/80 line-clamp-1">{title}</p>
    </div>
  );
};
