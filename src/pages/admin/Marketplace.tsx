import React from 'react';

const Marketplace: React.FC = () => {
  const items = [
    { title: 'Listed Items', value: '234', status: 'active' },
    { title: 'Pending Review', value: '45', status: 'pending' },
    { title: 'Sold Items', value: '189', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Marketplace</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
            <p className="mt-2 text-2xl font-semibold text-[#464255]">{item.value}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
              item.status === 'active' ? 'bg-green-100 text-green-800' :
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Marketplace;
