'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Star, MapPin, Wifi, Car, Coffee, Tv, Bath, Bed, Calendar, Users, Heart, Share2, 
  CheckCircle, Clock, Shield, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight,
  BedDouble, Utensils, Waves, Dumbbell, Car as CarIcon, Zap
} from 'lucide-react';
import ReviewCard from '../../../components/ReviewCard';
import { NormalizedReview } from '../../../types/review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchPropertyReviews();
  }, [slug]);

  const fetchPropertyReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        // Filter reviews for this property and only show approved/public ones
        const propertyReviews = data.data.filter((review: NormalizedReview) => 
          review.listingId === slug && review.isApproved && review.isPublic
        );
        setReviews(propertyReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const propertyName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const avgRating = reviews.length > 0 
    ? Math.round((reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length) * 10) / 10 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  // Mock property data that would come from API
  const property = {
    id: slug,
    name: propertyName,
    location: "London, UK",
    type: "Luxury Apartment",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    pricePerNight: 120,
    currency: "GBP",
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", alt: "Living room" },
      { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", alt: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800", alt: "Bedroom" },
      { url: "https://images.unsplash.com/photo-1584622781564-1d987ce72c20?w=800", alt: "Bathroom" },
    ],
    description: "Experience modern living in this beautifully designed 2-bedroom apartment in the heart of London. Featuring contemporary furnishings, high-end amenities, and stunning city views, this property offers the perfect blend of comfort and style for both business and leisure travelers.",
    keyFeatures: [
      "Prime London location",
      "Modern furnishings",
      "High-speed WiFi",
      "Professional cleaning",
      "24/7 support",
      "Contactless check-in"
    ],
    amenities: {
      essential: [
        { icon: Wifi, label: "High-speed WiFi", included: true },
        { icon: Tv, label: "Smart TV with Netflix", included: true },
        { icon: Coffee, label: "Nespresso machine", included: true },
        { icon: Utensils, label: "Fully equipped kitchen", included: true },
      ],
      comfort: [
        { icon: BedDouble, label: "Premium bedding", included: true },
        { icon: Bath, label: "Luxury bathroom", included: true },
        { icon: Zap, label: "Air conditioning", included: true },
        { icon: Shield, label: "Safe", included: true },
      ],
      building: [
        { icon: CarIcon, label: "Parking available", included: false },
        { icon: Dumbbell, label: "Gym access", included: false },
        { icon: Waves, label: "Pool", included: false },
        { icon: Users, label: "Concierge", included: true },
      ]
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleViewMoreReviews = () => {
    setShowAllReviews(!showAllReviews);
    // Smooth scroll to reviews section if expanding
    if (!showAllReviews) {
      setTimeout(() => {
        const reviewsSection = document.querySelector('[data-reviews-section]');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleViewMoreReviews();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] bg-black">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={property.images[currentImageIndex].url}
            alt={property.images[currentImageIndex].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Property Header Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between text-white">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">{property.name}</h1>
                  <div className="flex items-center space-x-4 text-lg">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-5 w-5" />
                      <span>{property.location}</span>
                    </div>
                    {reviews.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.round(avgRating))}
                        </div>
                        <span className="font-medium">{avgRating}/5</span>
                        <span className="text-white/80">({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Property Overview</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.bedrooms} bedrooms</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} bathroom</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Up to {property.maxGuests} guests</span>
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {property.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What makes this place special</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Amenities</CardTitle>
                <CardDescription>Everything you need for a comfortable stay</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="essential" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="essential">Essential</TabsTrigger>
                    <TabsTrigger value="comfort">Comfort</TabsTrigger>
                    <TabsTrigger value="building">Building</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="essential" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.amenities.essential.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                          <amenity.icon className="h-5 w-5 text-primary" />
                          <span className="text-foreground">{amenity.label}</span>
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comfort" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.amenities.comfort.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                          <amenity.icon className="h-5 w-5 text-primary" />
                          <span className="text-foreground">{amenity.label}</span>
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="building" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.amenities.building.map((amenity, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          !amenity.included ? 'opacity-50' : ''
                        }`}>
                          <amenity.icon className="h-5 w-5 text-primary" />
                          <span className="text-foreground">{amenity.label}</span>
                          {amenity.included ? (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          ) : (
                            <span className="text-xs text-muted-foreground ml-auto">Not available</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card data-reviews-section>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Guest Reviews</CardTitle>
                    <CardDescription>
                      {reviews.length > 0 
                        ? (reviews.length > 3 && !showAllReviews 
                            ? `Showing 3 of ${reviews.length} verified guest reviews`
                            : `${reviews.length} verified guest reviews`
                          )
                        : 'No reviews yet'
                      }
                    </CardDescription>
                  </div>
                  {reviews.length > 0 && (
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.round(avgRating))}
                        </div>
                        <span className="text-2xl font-bold text-foreground">{avgRating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">out of 5 stars</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground">Loading reviews...</span>
                    </div>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {(showAllReviews ? reviews : reviews.slice(0, 3)).map(review => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        showControls={false}
                      />
                    ))}
                    {reviews.length > 3 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline"
                          onClick={handleViewMoreReviews}
                          onKeyDown={handleKeyDown}
                          className="transition-all duration-200 hover:scale-105"
                          aria-expanded={showAllReviews}
                          aria-label={showAllReviews ? 'Show fewer reviews' : `Expand to view all ${reviews.length} reviews`}
                        >
                          {showAllReviews 
                            ? '↑ Show less' 
                            : `↓ View all ${reviews.length} reviews`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Star className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">No reviews yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to share your experience and help future guests!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        £{property.pricePerNight}
                      </CardTitle>
                      <CardDescription className="text-base">per night</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Great Value
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Check-in</label>
                        <Input type="date" className="text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Check-out</label>
                        <Input type="date" className="text-sm" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Guests</label>
                      <Select defaultValue="2">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 guest</SelectItem>
                          <SelectItem value="2">2 guests</SelectItem>
                          <SelectItem value="3">3 guests</SelectItem>
                          <SelectItem value="4">4 guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>£{property.pricePerNight} × 3 nights</span>
                      <span>£{property.pricePerNight * 3}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cleaning fee</span>
                      <span>£25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>£15</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>£{property.pricePerNight * 3 + 25 + 15}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Reserve Now
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      You won't be charged yet
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>Free cancellation</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Instant booking</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Host Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hosted by Flex Living</CardTitle>
                  <CardDescription>Professional serviced apartments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Flex Living Team</h4>
                      <p className="text-sm text-muted-foreground">Superhost · 5 years hosting</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Response rate: 100%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Response time: within an hour</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Languages: English, Spanish, French</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Safety & Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Safety & Protection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Enhanced cleaning protocol</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Contactless check-in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>24/7 guest support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Verified property</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 