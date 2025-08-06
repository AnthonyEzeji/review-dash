'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, TrendingUp, Users, Star, Building, Plus, MoreHorizontal } from 'lucide-react';
import ReviewCard from '../../components/ReviewCard';
import { NormalizedReview } from '../../types/review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface Analytics {
  totalReviews: number;
  avgRating: number;
  ratingDistribution: Record<string, number>;
  byProperty: Record<string, any>;
}

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rating: 'all',
    channel: 'all',
    property: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reviews, searchTerm, filters]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.listingName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.rating !== 'all') {
      const rating = parseInt(filters.rating);
      filtered = filtered.filter(review => Math.round(review.overallRating) === rating);
    }

    if (filters.channel !== 'all') {
      filtered = filtered.filter(review => review.channel === filters.channel);
    }

    if (filters.property !== 'all') {
      filtered = filtered.filter(review => review.listingId === filters.property);
    }

    if (filters.status !== 'all') {
      if (filters.status === 'approved') {
        filtered = filtered.filter(review => review.isApproved);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(review => !review.isApproved);
      }
    }

    setFilteredReviews(filtered);
  };

  const handleApprovalChange = async (reviewId: number, isApproved: boolean) => {
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved })
      });

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, isApproved } : review
      ));
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handlePublicChange = async (reviewId: number, isPublic: boolean) => {
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isPublic })
      });

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, isPublic } : review
      ));
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const exportData = () => {
    const csvData = filteredReviews.map(review => ({
      id: review.id,
      guest: review.guestName,
      property: review.listingName,
      rating: review.overallRating,
      content: review.content,
      channel: review.channel,
      date: review.submittedAt,
      approved: review.isApproved,
      public: review.isPublic
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviews-export.csv';
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ rating: 'all', channel: 'all', property: 'all', status: 'all' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const uniqueProperties = Array.from(new Set(reviews.map(r => r.listingId)));
  const uniqueChannels = Array.from(new Set(reviews.map(r => r.channel)));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Reviews Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage and analyze guest reviews across all properties
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={exportData} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Review</span>
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{analytics.totalReviews}</div>
                <p className="text-xs text-muted-foreground">Across all properties</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{analytics.avgRating}/5</div>
                <p className="text-xs text-muted-foreground">Guest satisfaction</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(analytics.byProperty).length}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{analytics.ratingDistribution['5']}</div>
                <p className="text-xs text-muted-foreground">Excellent ratings</p>
              </CardContent>
            </Card>
          </div>
        )}



        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <CardDescription>Filter reviews to find exactly what you're looking for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.channel} onValueChange={(value) => setFilters(prev => ({ ...prev, channel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {uniqueChannels.map(channel => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.property} onValueChange={(value) => setFilters(prev => ({ ...prev, property: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {uniqueProperties.map(propertyId => {
                    const property = reviews.find(r => r.listingId === propertyId);
                    return (
                      <SelectItem key={propertyId} value={propertyId}>
                        {property?.listingName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                Reviews
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{filteredReviews.length} results</Badge>
                {(searchTerm || filters.rating !== 'all' || filters.channel !== 'all' || filters.property !== 'all' || filters.status !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                showControls={true}
                onApprovalChange={handleApprovalChange}
                onPublicChange={handlePublicChange}
              />
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">No reviews found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find what you're looking for.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 