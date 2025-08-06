import React from 'react';
import { Star, Calendar, MapPin, User, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { NormalizedReview } from '../types/review';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ReviewCardProps {
  review: NormalizedReview;
  onApprovalChange?: (reviewId: number, isApproved: boolean) => void;
  onPublicChange?: (reviewId: number, isPublic: boolean) => void;
  showControls?: boolean;
}

export default function ReviewCard({ 
  review, 
  onApprovalChange, 
  onPublicChange, 
  showControls = false 
}: ReviewCardProps) {
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

  const getChannelBadgeVariant = (channel: string) => {
    switch (channel) {
      case 'hostaway': return 'default';
      case 'airbnb': return 'destructive';
      case 'booking': return 'secondary';
      case 'google': return 'outline';
      default: return 'secondary';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(review.guestName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">{review.guestName}</h4>
                <Badge variant={getChannelBadgeVariant(review.channel)} className="text-xs">
                  {review.channel}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{review.listingName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(review.submittedAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(review.overallRating))}
              <span className="text-sm font-medium text-foreground ml-1">
                {review.overallRating}/5
              </span>
            </div>
            {showControls && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Review</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete Review
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Content */}
        <p className="text-foreground leading-relaxed">{review.content}</p>

        {/* Category Ratings */}
        {review.categories && review.categories.length > 0 && (
          <div className="space-y-3">
            <Separator />
            <div>
              <h5 className="text-sm font-medium text-foreground mb-3">Category Ratings</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {review.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <span className="text-sm capitalize text-muted-foreground">
                      {category.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-0.5">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i < category.rating ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{category.rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="space-y-3">
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`approved-${review.id}`}
                    checked={review.isApproved}
                    onCheckedChange={(checked) => onApprovalChange?.(review.id, checked)}
                  />
                  <label 
                    htmlFor={`approved-${review.id}`}
                    className="text-sm font-medium cursor-pointer flex items-center space-x-1"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Approved</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`public-${review.id}`}
                    checked={review.isPublic}
                    onCheckedChange={(checked) => onPublicChange?.(review.id, checked)}
                    disabled={!review.isApproved}
                  />
                  <label 
                    htmlFor={`public-${review.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    Show on Website
                  </label>
                </div>
              </div>
              
              <Badge 
                variant={review.isApproved ? "default" : "secondary"}
                className="flex items-center space-x-1"
              >
                {review.isApproved ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Approved</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    <span>Pending</span>
                  </>
                )}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 