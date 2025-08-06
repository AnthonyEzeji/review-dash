import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Star, Building, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Professional Review Management
          </Badge>
          <h1 className="text-6xl font-bold text-foreground mb-6 tracking-tight">
            Welcome to
            <span className="block text-primary">Reviews Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive review management and analytics platform. 
            Monitor performance, approve reviews for public display, and gain deep insights into guest satisfaction across all your properties.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/property/2b-n1-a-29-shoreditch-heights">
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Property Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Manager Dashboard Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Manager Dashboard</CardTitle>
                  <CardDescription className="text-base">Complete review oversight</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive review management with advanced filtering, real-time analytics, and intelligent approval workflows. 
                Monitor property performance and identify trends across all platforms.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Advanced filtering & search</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Real-time analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Bulk approval workflows</span>
                </div>
              </div>

              <Link href="/dashboard" className="block">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  <span>Access Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Public Reviews Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Property Reviews</CardTitle>
                  <CardDescription className="text-base">Guest-facing display</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Beautiful, responsive review displays that integrate seamlessly with your property pages. 
                Only approved reviews are shown to maintain quality and trust.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Curated approved reviews only</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span>Category rating breakdowns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span>Responsive design integration</span>
                </div>
              </div>

              <Link href="/property/2b-n1-a-29-shoreditch-heights" className="block">
                <Button variant="outline" className="w-full group-hover:bg-accent transition-colors">
                  <span>View Property Demo</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Platform Overview</CardTitle>
            <CardDescription className="text-lg">
              Comprehensive review management across all channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="bg-blue-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Unified Review Management</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Centralize reviews from all booking platforms and channels in one comprehensive dashboard
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-yellow-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Smart Analytics</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Track ratings, identify trends, and monitor property performance with advanced metrics and insights
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-purple-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                  <Shield className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Quality Control</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Approve, moderate, and curate reviews with sophisticated workflows and bulk operations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Started Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Transform your review management workflow today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/properties">
                    Browse Properties
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Experience the complete review management solution for modern property managers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 