import { Airplay } from "lucide-react";

export default function PartnersSection() {
  return (
    <div className="py-8 bg-[#371373] rounded-xl">
      <p className="text-center text-gray-200 font-bold">
        Travaillez avec les entreprises innovantes en Guinée et en Afrique
      </p>
      <div className="w-full flex justify-center gap-8 px-12 md:px-0 mt-4">
        <Airplay size={56} color="#fff" className="text-white" />
        <Airplay size={56} color="#fff" className="text-white" />
        <Airplay size={56} color="#fff" className="text-white" />
        <Airplay size={56} color="#fff" className="text-white" />
      </div>
    </div>
  );
}