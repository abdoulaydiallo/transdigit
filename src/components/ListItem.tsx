import { FiCheckCircle } from "react-icons/fi";

type Props = {
  title: string;
  className?: string;
};

export const ListItem = ({ title, className = "" }: Props) => {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 group ${className}`}
    >
      <FiCheckCircle className="w-5 h-5 text-secondary flex-shrink-0  transition-transform duration-300" />
      <p className="text-base font-medium text-gray-900 line-clamp-1">
        {title}
      </p>
    </div>
  );
};