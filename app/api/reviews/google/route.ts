import { NextRequest, NextResponse } from 'next/server';
import mockData from '../../../../data/mockReviews.json';

// Note: This would require Google Places API key in production
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // Since we don't have a real Google Places API key, return mock data
    // and findings about Google Reviews integration
    
    const findings = {
      integration_feasible: true,
      requirements: [
        "Google Places API key required",
        "Need to identify Place IDs for each property",
        "Rate limits: 1000 requests per day (free tier)",
        "Reviews are read-only via API"
      ],
      limitations: [
        "Cannot filter reviews by date range",
        "Limited to most recent reviews",
        "No control over which reviews are shown",
        "Cannot modify or respond to reviews via API"
      ],
      costs: {
        places_api: "$17 per 1000 requests after free tier",
        places_details: "$17 per 1000 requests"
      },
      implementation_notes: [
        "Would need to map each property to a Google Place ID",
        "Reviews would need to be cached to avoid API limits",
        "Consider using Google My Business API for more control"
      ]
    };

    // Map Google reviews to different properties for demonstration
    const propertyMappings = [
      { name: "2B N1 A - 29 Shoreditch Heights", id: "2b-n1-a-29-shoreditch-heights" },
      { name: "1B S2 B - 15 Camden Lock View", id: "1b-s2-b-15-camden-lock-view" }
    ];

    const mockGoogleReviews = mockData.google.map((review, index) => {
      const property = propertyMappings[index % propertyMappings.length];
      return {
        id: `google_${index + 1}`,
        type: 'guest-to-host' as const,
        status: 'published' as const,
        overallRating: review.rating,
        content: review.text,
        categories: [], // Google reviews don't typically have category breakdowns
        submittedAt: new Date(review.time * 1000).toISOString(),
        guestName: review.author_name,
        listingName: property.name,
        listingId: property.id,
        channel: 'google' as const,
        isApproved: true,
        isPublic: true
      };
    });

    return NextResponse.json({
      success: true,
      data: mockGoogleReviews,
      source: 'mock',
      google_integration_findings: findings,
      message: "Google Reviews integration is feasible but requires API key and Place IDs"
    });

  } catch (error) {
    console.error('Error with Google Reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Google Reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 