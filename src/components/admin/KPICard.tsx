interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const KPICard = ({ title, value, icon, color }: KPICardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full ${color} flex items-center justify-center text-lg sm:text-2xl flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
