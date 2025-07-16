import { Button } from "@/components/ui/button";
import { ListItem } from "@/components/ListItem";
import { CardTool } from "@/components/CardTool";
import { SectionContentProps, SectionChild, ButtonChild, Curriculum, Module } from "@/types/course";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

export function SectionContent({ title, subtitle, description, items, children }: SectionContentProps) {
  const isCurriculum = (child: any): child is Curriculum => {
    return child && child.overviewTitle && child.overviewDescription && Array.isArray(child.modules) && Array.isArray(child.technologies);
  };

  const [activeModuleTab, setActiveModuleTab] = useState<string>("");

  return (
    <section
      className="my-8 md:my-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto"
      role="region"
      aria-labelledby={`section-title-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      <h2
        id={`section-title-${title.toLowerCase().replace(/\s/g, '-')}`}
        className="text-sm md:text-base uppercase tracking-wide text-[#670BFF] font-semibold mb-4 md:mb-6"
      >
        {title}
      </h2>
      {subtitle && (
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {subtitle}
        </h3>
      )}
      {description && (
        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-8">
          {description}
        </p>
      )}
      {items && (
        <ul className="space-y-3 md:space-y-4 mb-8" role="list">
          {items.map((item, index) => (
            <ListItem key={index} title={item} />
          ))}
        </ul>
      )}
      {children && (
        <div className="space-y-8 md:space-y-12">
          {isCurriculum(children) ? (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {children.overviewTitle}
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-8">
                {children.overviewDescription}
              </p>
              <Tabs
                value={activeModuleTab || children.modules[0]?.title.toLowerCase().replace(/\s/g, '-') || ""}
                onValueChange={setActiveModuleTab}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                  <TabsList className="col-span-1 flex flex-col space-y-2 bg-white md:pr-4">
                    {children.modules.map((module) => (
                      <TabsTrigger
                        key={module.number}
                        value={module.title.toLowerCase().replace(/\s/g, '-')}
                        className={`relative text-sm sm:text-base font-medium px-4 py-2 text-left transition-all duration-200 w-full ${
                          activeModuleTab === module.title.toLowerCase().replace(/\s/g, '-')
                            ? "text-white bg-[#5609D6] rounded-md after:absolute after:right-[-2px] after:top-0 after:bottom-0 "
                            : "text-gray-600 hover:text-[#5609D6] hover:bg-[#5609D6]/10 rounded-md"
                        }`}
                        aria-label={`Afficher le module ${module.title}`}
                      >
                        {module.number}. {module.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="col-span-1 md:col-span-3">
                    {children.modules.map((module) => (
                      <TabsContent
                        key={module.number}
                        value={module.title.toLowerCase().replace(/\s/g, '-')}
                        className="mt-0"
                      >
                        <div className="p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2 md:mb-3">
                            <h4 className="text-base md:text-lg font-semibold text-gray-900">
                              {module.number}. {module.title}
                            </h4>
                            <span className="text-sm md:text-base text-gray-600 font-medium">
                              {module.duration}
                            </span>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                            {module.description}
                          </p>
                          {module.steps && module.steps.length > 0 && (
                            <>
                              <h5 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">
                                Étapes du module :
                              </h5>
                              <ul className="space-y-2 md:space-y-3" role="list">
                                {module.steps.map((step, index) => (
                                  <ListItem key={index} title={step} />
                                ))}
                              </ul>
                            </>
                          )}
                          {module.tools && module.tools.length > 0 && (
                            <div className="mt-4 md:mt-6">
                              <h5 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">
                                Outils utilisés :
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                {module.tools.map((tool) => (
                                  <div
                                    key={tool.name}
                                    className="transform transition-all duration-200 hover:shadow-sm hover:-translate-y-1"
                                  >
                                    <CardTool src={tool.src} name={tool.name} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </div>
              </Tabs>
            </>
          ) : Array.isArray(children) ? (
            children.map((child, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
              >
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  {child.title}
                </h4>
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
                  {child.description}
                </p>
                {child.project && (
                  <>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                      {child.project}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {child.projectDescription}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : children.type === "button" ? (
            <div className="flex justify-center md:justify-start">
              <Button
                size={children.size || "lg"}
                className="w-full sm:w-auto bg-[#670BFF] text-white hover:bg-[#5609D6] text-xs sm:text-sm md:text-base rounded-md"
              >
                {children.label}
              </Button>
            </div>
          ) : (
            <div className="p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 text-center md:text-start">
                {children.title}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {Array.isArray(children.content) &&
                  children.content.map((tool) => (
                    <div
                      key={tool.name}
                      className="transform transition-all duration-200 hover:shadow-sm hover:-translate-y-1"
                    >
                      <CardTool src={tool.src} name={tool.name} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}