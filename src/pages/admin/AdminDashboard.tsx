import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%' },
    { title: 'Active Posts', value: '456', change: '+8%' },
    { title: 'Premium Users', value: '89', change: '+15%' },
    { title: 'Reports', value: '23', change: '-5%' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-[#464255]">{stat.value}</p>
              <span className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;