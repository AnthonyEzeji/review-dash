import React from 'react';
import Link from 'next/link';
import { Building, Star, MapPin, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const properties = [
  {
    id: '2b-n1-a-29-shoreditch-heights',
    name: '2B N1 A - 29 Shoreditch Heights',
    location: 'Shoreditch, London',
    type: '2 Bedroom Apartment',
    rating: 4.8,
    reviewCount: 24,
    price: '£120/night',
    status: 'Active',
    image: '/api/placeholder/400/250'
  },
  {
    id: '1b-s2-b-15-camden-lock-view',
    name: '1B S2 B - 15 Camden Lock View',
    location: 'Camden, London',
    type: '1 Bedroom Apartment',
    rating: 4.6,
    reviewCount: 18,
    price: '£95/night',
    status: 'Active',
    image: '/api/placeholder/400/250'
  },
  {
    id: 'studio-e1-c-8-canary-wharf-tower',
    name: 'Studio E1 C - 8 Canary Wharf Tower',
    location: 'Canary Wharf, London',
    type: 'Studio Apartment',
    rating: 4.2,
    reviewCount: 12,
    price: '£85/night',
    status: 'Active',
    image: '/api/placeholder/400/250'
  }
];

export default function PropertiesPage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Properties</h1>
            <p className="text-muted-foreground text-lg">
              Manage and view all Flex Living properties
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Add Property</span>
            </Button>
            <Link href="/dashboard">
              <Button className="flex items-center space-x-2">
                <span>View Analytics</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                  <Building className="h-12 w-12 text-primary/40" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{property.name}</CardTitle>
                    <Badge variant="outline">{property.status}</Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{property.location}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{property.type}</span>
                  <span className="font-semibold text-foreground">{property.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(property.rating)}
                    </div>
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({property.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Link href={`/property/${property.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Property
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="px-3">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>Overview of all properties and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">{properties.length}</div>
                <div className="text-sm text-muted-foreground">Total Properties</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {(properties.reduce((acc, p) => acc + p.rating, 0) / properties.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {properties.reduce((acc, p) => acc + p.reviewCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Occupancy Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 