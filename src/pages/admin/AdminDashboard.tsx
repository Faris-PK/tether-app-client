import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { adminApi } from '../../api/adminApi'; 

// Custom Tooltip for more detailed information
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <p className="font-bold text-[#464255]">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPremiumUsers: 0,
    totalPosts: 0,
    totalActiveUsers: 0,
  });

  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users
        const usersResponse = await adminApi.getUsers({ limit: 1000 });
        
        // Fetch posts
        const postsResponse = await adminApi.getPosts({ limit: 1000 });

        // Prepare user growth data (simulated for this example)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const simulatedUserGrowth = daysOfWeek.map((day, ) => ({
          name: day,
          'New users': Math.max(5, Math.floor(Math.random() * 30)),
          'Active users': Math.max(10, Math.floor(Math.random() * 50)),
          'Blocked users': Math.max(1, Math.floor(Math.random() * 10))
        }));

        // Prepare post data (simulated)
        const simulatedPostData = daysOfWeek.map((day, ) => ({
          name: day,
          'Posts': Math.max(5, Math.floor(Math.random() * 20)),
          'Comments': Math.max(10, Math.floor(Math.random() * 40)),
          'Likes': Math.max(20, Math.floor(Math.random() * 100))
        }));

        setDashboardStats({
          totalUsers: usersResponse.totalUsers,
          totalPremiumUsers: usersResponse.users.filter(user => user.premium_status == true).length,
          totalPosts: postsResponse.totalPosts,
          totalActiveUsers: usersResponse.users.filter(user => user).length,
        });

        setUserGrowthData(simulatedUserGrowth);
        setPostData(simulatedPostData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Color palette
  const COLORS = ['#00B074', '#7F56D9', '#F24848', '#FFBB28'];

  return (
    <div className="space-y-6 p-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-[#464255] mb-6">Admin Dashboard</h2>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: dashboardStats.totalUsers },
          { label: 'Premium Users', value: dashboardStats.totalPremiumUsers },
          { label: 'Total Posts', value: dashboardStats.totalPosts },
          { label: 'Active Users', value: dashboardStats.totalActiveUsers }
        ].map((metric, index) => (
          <div 
            key={metric.label} 
            className="bg-white shadow-md rounded-lg p-5 transform transition-all hover:scale-105 hover:shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-600 mb-2">{metric.label}</h3>
            <p className="text-3xl font-bold" style={{ color: COLORS[index] }}>
              {metric.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold text-[#464255] mb-4">User Growth Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="New users" fill="#00B074" />
              <Bar dataKey="Active users" fill="#7F56D9" />
              <Bar dataKey="Blocked users" fill="#F24848" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Post Activity Line Chart */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold text-[#464255] mb-4">Post Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={postData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Posts" 
                stroke="#00B074" 
                strokeWidth={3} 
                dot={{ strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Comments" 
                stroke="#7F56D9" 
                strokeWidth={3} 
                strokeDasharray="5 5"
                dot={{ strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Likes" 
                stroke="#F24848" 
                strokeWidth={3} 
                dot={{ strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold text-[#464255] mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active Users', value: dashboardStats.totalActiveUsers },
                  { name: 'Inactive Users', value: dashboardStats.totalUsers - dashboardStats.totalActiveUsers },
                  { name: 'Premium Users', value: dashboardStats.totalPremiumUsers }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map(( index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;