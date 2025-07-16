type Props = {
  children: React.ReactNode;
};

export const Container = ({ children }: Props) => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">{children}</div>
  );
};
