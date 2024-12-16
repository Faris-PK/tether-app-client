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
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { debounce } from 'lodash';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    await fetchReports(currentPage, term);
  }, 500);

  useEffect(() => {
    // Reset to first page when filter changes
    setCurrentPage(1);
    fetchReports(1);
  }, [filter]);

  useEffect(() => {
    // Trigger search when search term changes
    if (searchTerm !== '') {
      debouncedSearch(searchTerm);
    } else {
      fetchReports(currentPage);
    }

    // Cleanup debounce
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  useEffect(() => {
    // Fetch reports when page changes
    fetchReports(currentPage);
  }, [currentPage]);

  const fetchReports = async (page: number, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApi.getAllReports({
        page,
        limit: pageSize,
        filter,
        search: searchQuery || searchTerm
      });

      // Update states
      setReports(response.reports);
      setTotalPages(response.totalPages);
      setTotalReports(response.totalReports);
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
            onClick={() => fetchReports(currentPage)}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border">
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
                {reports.map((report) => (
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalReports)} of {totalReports} reports
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;