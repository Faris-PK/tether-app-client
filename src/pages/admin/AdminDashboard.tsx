import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Static data for the dashboard
const dashboardData = {
  totalUsers: 75,
  totalPremiumUsers: 25,
  totalPosts: 65,
  totalActiveUsers: 60,
  userGrowth: [
    { name: 'Sun', 'New users': 22, 'Blocked users': 81, 'Active users': 62 },
    { name: 'Mon', 'New users': 15, 'Blocked users': 76, 'Active users': 55 },
    { name: 'Tue', 'New users': 18, 'Blocked users': 70, 'Active users': 49 },
    { name: 'Wed', 'New users': 20, 'Blocked users': 65, 'Active users': 45 },
    { name: 'Thu', 'New users': 17, 'Blocked users': 58, 'Active users': 41 },
    { name: 'Fri', 'New users': 10, 'Blocked users': 52, 'Active users': 35 },
    { name: 'Sat', 'New users': 8, 'Blocked users': 47, 'Active users': 30 },
  ],
  postAndComments: [
    { name: 'Sun', Posts: 12, Comments: 35, Likes: 85 },
    { name: 'Mon', Posts: 9, Comments: 28, Likes: 72 },
    { name: 'Tue', Posts: 13, Comments: 32, Likes: 68 },
    { name: 'Wed', Posts: 11, Comments: 40, Likes: 75 },
    { name: 'Thu', Posts: 10, Comments: 30, Likes: 60 },
    { name: 'Fri', Posts: 8, Comments: 25, Likes: 55 },
    { name: 'Sat', Posts: 6, Comments: 20, Likes: 45 },
  ],
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255]">Total Users</h3>
          <p className="text-3xl font-bold text-[#00B074]">{dashboardData.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255]">Total Premium Users</h3>
          <p className="text-3xl font-bold text-[#00B074]">{dashboardData.totalPremiumUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255]">Total Posts</h3>
          <p className="text-3xl font-bold text-[#00B074]">{dashboardData.totalPosts.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255]">Total Active Users</h3>
          <p className="text-3xl font-bold text-[#00B074]">{dashboardData.totalActiveUsers.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255] mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dashboardData.userGrowth}>
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <Tooltip />
              <Legend iconSize={10} />
              <Line type="monotone" dataKey="New users" stroke="#00B074" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Blocked users" stroke="#F24848" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Active users" stroke="#7F56D9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#464255] mb-4">Posts and Comments</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dashboardData.postAndComments}>
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
              <Tooltip />
              <Legend iconSize={10} />
              <Line type="monotone" dataKey="Posts" stroke="#00B074" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Comments" stroke="#7F56D9" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="Likes" stroke="#F24848" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;