import { Button } from "@/components/ui/button";
import { Tab } from "@/types/course";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  tabs: Tab[];
}

export function TabNavigation({ activeTab, setActiveTab, tabs }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-white w-full flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between border-b border-b-[#670BFF] py-2 lg:sticky">
      <div className="relative flex w-full overflow-x-auto scrollbar-hidden">
        <div className="flex flex-nowrap gap-1 sm:gap-2 lg:gap-4 items-center px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-sm sm:text-base md:font-light px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#670BFF] text-white font-bold shadow-sm"
                  : "hover:bg-[#f5f2fb] hover:text-[#670BFF] text-gray-700"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#670BFF] focus-visible:ring-offset-2`}
              aria-current={activeTab === tab.key ? "true" : "false"}
              aria-label={`Afficher la section ${tab.title}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* Gradient pour indiquer le défilement sur mobile */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" />
      </div>
      <div className="w-full md:w-auto flex justify-center md:justify-end px-4 py-2">
        <Button className="w-full md:w-auto text-xs sm:text-sm" variant="outline">
         Programme
        </Button>
      </div>
    </div>
  );
}