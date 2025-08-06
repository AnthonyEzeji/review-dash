import { NextRequest, NextResponse } from 'next/server';
import { HostawayApiResponse, NormalizedReview } from '../../../../types/review';
import mockData from '../../../../data/mockReviews.json';

const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID || '61148';
const API_KEY = process.env.HOSTAWAY_API_KEY || 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

function calculateOverallRating(categories: any[]): number {
  if (!categories || categories.length === 0) return 0;
  const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
  const avgOutOf10 = sum / categories.length;
  // Convert from 10-point to 5-point scale
  return Math.round((avgOutOf10 / 2) * 10) / 10;
}

function normalizeHostawayReviews(hostawayData: HostawayApiResponse): NormalizedReview[] {
  return hostawayData.result.map(review => {
    // If review.rating exists, it's already on 5-point scale
    // If not, calculate from categories (which are on 10-point scale)
    const overallRating = review.rating || calculateOverallRating(review.reviewCategory);
    
    // Extract listing ID from listing name (simplified approach)
    const listingId = review.listingName
      .replace(/\s+/g, '-')  // Replace spaces with dashes
      .replace(/-+/g, '-')   // Replace multiple consecutive dashes with single dash
      .toLowerCase();
    
    return {
      id: review.id,
      type: review.type as 'host-to-guest' | 'guest-to-host',
      status: review.status as 'published' | 'draft' | 'hidden',
      overallRating: overallRating, // Already on 5-point scale
      content: review.publicReview,
      categories: review.reviewCategory,
      submittedAt: review.submittedAt,
      guestName: review.guestName,
      listingName: review.listingName,
      listingId,
      channel: 'hostaway',
      isApproved: review.status === 'published',
      isPublic: review.status === 'published'
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get('mock') === 'true';
    
    if (useMock) {
      // Use mock data for development/testing
      const normalizedReviews = normalizeHostawayReviews(mockData.hostaway as HostawayApiResponse);
      return NextResponse.json({
        success: true,
        data: normalizedReviews,
        source: 'mock'
      });
    }

    // Try to fetch from real Hostaway API (will likely be empty in sandbox)
    const response = await fetch(`${HOSTAWAY_API_BASE}/reviews`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status}`);
    }

    const data: HostawayApiResponse = await response.json();
    
    // If no reviews from API, fall back to mock data
    if (!data.result || data.result.length === 0) {
      const normalizedReviews = normalizeHostawayReviews(mockData.hostaway as HostawayApiResponse);
      return NextResponse.json({
        success: true,
        data: normalizedReviews,
        source: 'mock_fallback',
        message: 'No reviews found in Hostaway API, using mock data'
      });
    }

    const normalizedReviews = normalizeHostawayReviews(data);
    
    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      source: 'hostaway_api'
    });

  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    
    // Fallback to mock data on error
    try {
      const normalizedReviews = normalizeHostawayReviews(mockData.hostaway as HostawayApiResponse);
      return NextResponse.json({
        success: true,
        data: normalizedReviews,
        source: 'error_fallback',
        message: 'API error, using mock data'
      });
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch reviews and fallback failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }
} 