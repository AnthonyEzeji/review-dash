export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'draft' | 'hidden';
  overallRating: number;
  content: string;
  categories: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId: string;
  channel: 'hostaway' | 'airbnb' | 'booking' | 'google';
  isApproved: boolean;
  isPublic: boolean;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface DashboardFilters {
  rating?: number[];
  category?: string[];
  channel?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  listingId?: string[];
  status?: string[];
} 