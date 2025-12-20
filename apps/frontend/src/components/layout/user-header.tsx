const UserPageHeader = ({ title }: { title: string }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-center items-center">
      <span className="text-xl">{title}</span>
    </div>
  );
};

export default UserPageHeader;
