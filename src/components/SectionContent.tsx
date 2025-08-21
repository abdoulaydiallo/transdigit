import { Button } from "@/components/ui/button";
import { ListItem } from "@/components/ListItem";
import { CardTool } from "@/components/CardTool";
import { SectionContentProps, Curriculum } from "@/types/course";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { FiChevronRight, FiCode, FiTool, FiClock } from "react-icons/fi";

export function SectionContent({ title, subtitle, description, items, children }: SectionContentProps) {
  const isCurriculum = (child: unknown): child is Curriculum => {
    return (
      !!child &&
      typeof child === 'object' &&
      'overviewTitle' in child &&
      'overviewDescription' in child &&
      'modules' in child &&
      Array.isArray((child as Curriculum).modules) &&
      'technologies' in child &&
      Array.isArray((child as Curriculum).technologies)
    );
  };

  const [activeModuleTab, setActiveModuleTab] = useState<string>("");

  return (
    <section
      className="px-4 sm:px-6 md:px-12 border-gray-100"
      role="region"
      aria-labelledby={`section-title-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div className="py-8 md:py-12">
        <h2
          id={`section-title-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-base md:text-lg uppercase tracking-wider text-secondary font-bold mb-5 md:mb-7"
        >
          {title}
        </h2>
        {subtitle && (
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-5 tracking-tight">
            {subtitle}
          </h3>
        )}
        {description && (
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 max-w-4xl font-light">
            {description}
          </p>
        )}
        {items && (
          <ul className="space-y-0 mb-10" role="list">
            {items.map((item, index) => (
              <ListItem
                key={index}
                title={item}
                className="text-gray-600 hover:text-secondary transition-colors duration-300 flex items-center gap-3 group"
              />
               
            ))}
          </ul>
        )}
        {children && (
          <div className="space-y-10 md:space-y-12">
            {isCurriculum(children) ? (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {children.overviewTitle}
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-10 max-w-4xl font-light">
                  {children.overviewDescription}
                </p>
                <Tabs
                  value={activeModuleTab || children.modules[0]?.title.toLowerCase().replace(/\s/g, '-') || ""}
                  onValueChange={setActiveModuleTab}
                  className="w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                    <TabsList className="col-span-1 flex flex-col space-y-3 bg-transparent">
                      {children.modules.map((module) => (
                        <TabsTrigger
                          key={module.number}
                          value={module.title.toLowerCase().replace(/\s/g, '-')}
                          className={`relative text-base font-semibold px-5 py-3 text-left transition-all duration-300 w-full rounded-lg border border-gray-200 hover:border-secondary/30 hover:bg-secondary/5 group ${
                            activeModuleTab === module.title.toLowerCase().replace(/\s/g, '-')
                              ? "text-gray-900 bg-secondary/10 border-secondary/30 shadow-md shadow-secondary/10"
                              : "text-gray-600"
                          }`}
                          aria-label={`Afficher le module ${module.title}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-sm font-bold text-secondary group-hover:bg-secondary/20 transition-colors">
                              {module.number}
                            </span>
                            {module.title}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="col-span-1 md:col-span-3">
                      {children.modules.map((module) => (
                        <TabsContent
                          key={module.number}
                          value={module.title.toLowerCase().replace(/\s/g, '-')}
                          className="mt-0 animate-fade-in"
                        >
                          <div className="p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-5 gap-4">
                              <h4 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
                                {module.number}. {module.title}
                              </h4>
                              <span className="flex items-center gap-2 text-base text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-full">
                                <FiClock className="w-5 h-5 text-secondary" />
                                {module.duration}
                              </span>
                            </div>
                            <p className="text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
                              {module.description}
                            </p>
                            {module.steps && module.steps.length > 0 && (
                              <>
                                
                                <ul className="m-0" role="list">
                                  {module.steps.map((step, index) => (
                                    <ListItem
                                      key={index}
                                      title={step}
                                      className="text-gray-600 hover:text-secondary transition-colors duration-300 flex items-start gap-3 group"
                                    />
                                  ))}
                                </ul>
                              </>
                            )}
                            {module.tools && module.tools.length > 0 && (
                              <div className="mt-6 md:mt-8">
                               
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                                  {module.tools.map((tool) => (
                                    <div
                                      key={tool.name}
                                      className="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-secondary/5 rounded-lg border border-gray-100 p-3 flex flex-col items-center gap-2"
                                    >
                                      <CardTool src={tool.src} name={tool.name}/>
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
                  className="p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 tracking-tight">
                    {child.title}
                  </h4>
                  <p className="text-base text-gray-600 mb-4 md:mb-5 leading-relaxed">
                    {child.description}
                  </p>
                  {child.project && (
                    <>
                      <p className="text-base font-semibold text-gray-900 mb-2">
                        {child.project}
                      </p>
                      <p className="text-base text-gray-600 leading-relaxed">
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
                  className="text-white bg-secondary hover:bg-secondary/80 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-secondary/20 hover:scale-105"
                >
                  {children.label}
                </Button>
              </div>
            ) : (
              <div className="p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-5 text-center md:text-start tracking-tight">
                  {children.title}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                  {Array.isArray(children.content) &&
                    children.content.map((tool) => (
                      <div
                        key={tool.name}
                        className="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-secondary/5 rounded-lg border border-gray-100 p-3 flex flex-col items-center gap-2"
                      >
                        <CardTool src={tool.src} name={tool.name} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}