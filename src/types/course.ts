export interface Tab {
  title: string;
  key: string;
  active?: boolean;
}

export interface Tool {
  src: string;
  name: string;
}

export interface Partner {
  name: string;
}

export interface ButtonChild {
  type: "button";
  label: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export interface Module {
  number: number;
  title: string;
  duration: string;
  description: string;
  steps: string[];
  tools: Tool[];
}

export interface Curriculum {
  overviewTitle: string;
  overviewDescription: string;
  modules: Module[];
  technologies: Tool[];
}

export interface SectionChild {
  title?: string;
  description?: string;
  project?: string;
  projectDescription?: string;
  content?: Tool[];
  type?: "button";
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export interface SectionContentProps {
  title: string;
  subtitle: string;
  description: string;
  items?: string[];
  children?: SectionChild | SectionChild[] | ButtonChild | Curriculum;
}

export interface CourseDetail {
  key: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tabs: Tab[];
  partners: Partner[];
  sectionContents: Record<string, SectionContentProps>;
}