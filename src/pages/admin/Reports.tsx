import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import type { IReport } from '../../types/IReport';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock, Search, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAllReports(filter);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const updatedReport = await adminApi.updateReportStatus(reportId, newStatus);
      setReports(prev =>
        prev.map(report =>
          report._id === reportId ? updatedReport : report
        )
      );
    } catch (error) {
      console.error('Error updating report status:', error);
      setError('Failed to update report status. Please try again.');
    }
  };

  const handleBlockPost = async (postId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await adminApi.unblockPost(postId);
      } else {
        await adminApi.blockPost(postId);
      }
      await fetchReports(); // Refresh reports list
    } catch (error) {
      console.error('Error updating post status:', error);
      setError('Failed to update post status. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', icon: Clock },
      reviewed: { color: 'bg-blue-500', icon: AlertCircle },
      resolved: { color: 'bg-green-500', icon: CheckCircle2 },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredReports = reports.filter(report => {
    if (!report?.postId?.userId?.username || !report?.reportedBy?.username) {
      return false; // Skip invalid reports
    }

    const searchLower = searchTerm.toLowerCase();
    return (
      report.postId.userId.username.toLowerCase().includes(searchLower) ||
      report.reportedBy.username.toLowerCase().includes(searchLower) ||
      report.reason.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Reports Management</h2>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <Button 
            onClick={fetchReports}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border">
          <Table>
            <TableHeader className="bg-[#F7F6FE] sticky top-0">
              <TableRow>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Reported Post</TableHead>
                <TableHead className="hidden sm:table-cell">Reported By</TableHead>
                <TableHead className="hidden lg:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className="hidden md:table-cell"> 
                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {report.postId?.mediaUrl && (
                        <img
                          src={report.postId.mediaUrl}
                          alt="Post thumbnail"
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
              
                        <p className="font-medium">{report.postId?.userId?.username}</p>
                        <p className="text-sm text-gray-500 truncate w-48">
                          {report.postId?.caption}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{report.reportedBy?.username}</TableCell>
                  <TableCell className="hidden lg:table-cell">{report.reason}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Select
                              value={report.status}
                              onValueChange={(value: 'pending' | 'reviewed' | 'resolved') => 
                                handleStatusChange(report._id, value)
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => report.postId && handleBlockPost(report.postId._id, report.postId.isBlocked)}
                            className={report.postId?.isBlocked ? 'text-green-600' : 'text-red-600'}
                          >
                            {report.postId?.isBlocked ? 'Unblock Post' : 'Block Post'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default Reports;