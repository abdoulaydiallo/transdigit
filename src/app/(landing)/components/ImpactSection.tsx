import { ImpactStat } from "@/types/home";

interface ImpactSectionProps {
  stats: ImpactStat[];
}

export default function ImpactSection({ stats }: ImpactSectionProps) {
  return (
    <div className="my-12 md:my-24 px-4 md:px-0">
      <div className="flex flex-col gap-4 md:gap-8">
        <p className="text-center text-sm uppercase text-[#371373] font-semibold">
          Impact en Guinée
        </p>
        <h1 className="w-full md:max-w-screen-sm mx-auto text-2xl text-center font-semibold">
          Rejoignez la communauté tech guinéenne en pleine croissance
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-0 md:px-32 md:gap-8 py-8 md:py-12">
        {stats.map((stat, index) => (
          <div key={index}>
            <h1 className="text-4xl md:text-6xl font-bold text-[#371373] pb-2">
              {stat.value}
            </h1>
            <h3 className="text-2xl font-semibold pb-2">{stat.title}</h3>
            <p className="text-sm">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}