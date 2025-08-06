import { NextRequest, NextResponse } from 'next/server';
import { NormalizedReview } from '../../../types/review';

export async function GET(request: NextRequest) {
  try {
    // Fetch Hostaway reviews (using mock data by default)
    const hostawayResponse = await fetch(`${request.nextUrl.origin}/api/reviews/hostaway?mock=true`);
    const hostawayData = await hostawayResponse.json();

    // Fetch Google reviews
    const googleResponse = await fetch(`${request.nextUrl.origin}/api/reviews/google`);
    const googleData = await googleResponse.json();

    let allReviews: NormalizedReview[] = [];

    if (hostawayData.success) {
      allReviews = [...hostawayData.data];
    }

    if (googleData.success && googleData.data) {
      allReviews = [...allReviews, ...googleData.data];
    }

    // Add metadata for analytics
    const analytics = {
      totalReviews: allReviews.length,
      avgRating: allReviews.length > 0 
        ? Math.round((allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length) * 10) / 10 
        : 0,
      ratingDistribution: {
        5: allReviews.filter(r => r.overallRating === 5).length,
        4: allReviews.filter(r => r.overallRating >= 4 && r.overallRating < 5).length,
        3: allReviews.filter(r => r.overallRating >= 3 && r.overallRating < 4).length,
        2: allReviews.filter(r => r.overallRating >= 2 && r.overallRating < 3).length,
        1: allReviews.filter(r => r.overallRating >= 1 && r.overallRating < 2).length,
      },
      byProperty: allReviews.reduce((acc, review) => {
        if (!acc[review.listingId]) {
          acc[review.listingId] = {
            name: review.listingName,
            count: 0,
            avgRating: 0,
            totalRating: 0
          };
        }
        acc[review.listingId].count++;
        acc[review.listingId].totalRating += review.overallRating;
        acc[review.listingId].avgRating = Math.round((acc[review.listingId].totalRating / acc[review.listingId].count) * 10) / 10;
        return acc;
      }, {} as Record<string, any>)
    };

    return NextResponse.json({
      success: true,
      data: allReviews,
      analytics,
      sources: {
        hostaway: hostawayData.source,
        google: googleData.success ? 'mock' : 'error'
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, isApproved, isPublic } = body;

    // In a real app, this would update the database
    // For now, we'll just return success
    console.log(`Updating review ${reviewId}:`, { isApproved, isPublic });

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update review'
    }, { status: 500 });
  }
} 