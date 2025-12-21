const ActionButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`fixed bottom-8 right-3 ${className}`}>{children}</div>
  );
};

export default ActionButton;
