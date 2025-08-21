import { Button } from "@/components/ui/button";
import { Tab } from "@/types/course";
import { FiDownload } from "react-icons/fi";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  tabs: Tab[];
}

export function TabNavigation({ activeTab, setActiveTab, tabs }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-20 bg-white w-full flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100 py-4 px-4 sm:px-6 md:px-12 animate-slide-in">
      <div className="relative flex w-full overflow-x-auto scrollbar-hidden">
        <div className="flex flex-nowrap gap-2 sm:gap-3 lg:gap-4 items-center py-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative text-sm sm:text-base font-semibold px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-gray-900 bg-secondary/10 border-b-2 border-secondary shadow-sm"
                  : "text-gray-600 hover:bg-secondary/5 hover:text-secondary hover:shadow-sm"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2`}
              aria-current={activeTab === tab.key ? "true" : "false"}
              aria-label={`Afficher la section ${tab.title}`}
            >
              {tab.title}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform scale-x-100 transition-transform duration-300" />
              )}
            </button>
          ))}
        </div>
        {/* Gradient pour indiquer le défilement sur mobile */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent md:hidden" />
      </div>
      <div className="w-full md:w-auto flex justify-center md:justify-end px-4 py-2">
        <Button
          variant="default"
          className="w-full md:w-auto text-sm sm:text-base bg-secondary hover:bg-secondary/80 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-secondary/20 hover:scale-105 flex items-center gap-2"
        >
          <FiDownload className="w-5 h-5" />
          Programme
        </Button>
      </div>
    </div>
  );
}