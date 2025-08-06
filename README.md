# Flex Living Reviews Dashboard

A comprehensive review management system for Flex Living properties that integrates with Hostaway and other review platforms.

## Overview

The Reviews Dashboard provides property managers with tools to:
- Monitor guest reviews across all platforms
- Analyze property performance and identify trends
- Approve and moderate reviews for public display
- Export review data for reporting

## Brief Technical Documentation

### Key Design and Logic Decisions

#### 1. Data Normalization Strategy
**Decision**: Create unified `NormalizedReview` interface across all sources  
**Rationale**: Enables consistent UI rendering regardless of data source (Hostaway, Google, Airbnb)

```typescript
interface NormalizedReview {
  id: string | number;
  overallRating: number;        // Normalized to 5-point scale
  content: string;
  categories: ReviewCategory[]; // Preserves original 10-point ratings
  channel: 'hostaway' | 'google' | 'airbnb';
  isApproved: boolean;          // Manager approval
  isPublic: boolean;            // Public visibility
}
```

#### 2. Rating Scale Conversion
**Challenge**: Hostaway uses mixed 5-point (overall) and 10-point (categories) scales  
**Solution**: Smart detection and conversion with mathematical precision

```typescript
// Convert 10-point category averages to 5-point overall rating
const avgOutOf10 = sum / categories.length;
return Math.round((avgOutOf10 / 2) * 10) / 10;
```

#### 3. Two-Tier Approval System
**Decision**: Separate `isApproved` and `isPublic` flags  
**Rationale**: Allows managers to approve reviews internally before making them public

#### 4. Green Accent Color Theme
**Decision**: Professional green (`142 76% 36%`) as accent color  
**Rationale**: Conveys trust, growth, and professionalism for property management

### API Behaviors

#### Main Reviews Endpoint (`GET /api/reviews`)
```json
{
  "success": true,
  "data": [/* NormalizedReview[] */],
  "analytics": {
    "totalReviews": 8,
    "avgRating": 4.4,
    "ratingDistribution": {"1": 0, "2": 0, "3": 1, "4": 3, "5": 4},
    "byProperty": {/* property stats */}
  },
  "sources": {"hostaway": "mock", "google": "mock"}
}
```

#### Review Management (`PATCH /api/reviews`)
```json
// Request
{"reviewId": 7456, "isApproved": true, "isPublic": false}

// Response  
{"success": true, "message": "Review updated successfully"}
```

#### Hostaway Integration (`GET /api/reviews/hostaway`)
- **Mock Mode**: `?mock=true` returns development data
- **Live Mode**: Connects to Hostaway API with fallback
- **Data Processing**: Normalizes ratings, generates property slugs
- **Error Handling**: Graceful fallback to mock data on API errors

### Google Reviews Findings

#### Integration Feasibility: ✅ VIABLE

**Technical Requirements:**
1. **Google Places API Key** - Required for accessing review data
2. **Place IDs** - Each Flex Living property needs a Google Place ID
3. **API Integration** - Replace mock data with live API calls

**Cost Analysis:**
- **Free Tier**: 1,000 requests/day
- **Paid Tier**: $17 per 1,000 requests
- **Estimated Monthly Cost**: $50-200 depending on usage

**Limitations Identified:**
- **Read-Only Access**: Cannot modify or respond to reviews via API
- **Rate Limiting**: 1,000 requests/day free, then paid tiers
- **Recent Reviews Only**: Limited historical data access
- **No Filtering**: Cannot filter by date range or rating

**Current Status:**
- **✅ Architecture Ready**: Code structure supports live integration
- **✅ Data Flow Working**: Mock reviews integrate seamlessly
- **✅ UI Complete**: Channel indicators and review display ready
- **🔧 Implementation Needed**: Replace mock data with live API calls

## Features

### Manager Dashboard
- **Real-time Analytics**: View total reviews, average ratings, and property performance
- **Advanced Filtering**: Filter by rating, channel, property, status, and search terms
- **Review Management**: Approve/reject reviews and control public visibility
- **Data Export**: Export filtered review data to CSV
- **Multi-platform Integration**: Hostaway, Google Reviews, and more

### Public Property Pages
- **Approved Reviews Only**: Only manager-approved reviews are shown to guests
- **Consistent Design**: Matches Flex Living's website aesthetic
- **Rating Summaries**: Average ratings and review counts
- **Category Breakdowns**: Detailed category ratings (cleanliness, communication, etc.)

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date formatting and manipulation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Mock Data**: JSON-based mock data for development
- **Hostaway Integration**: Real API integration with fallback to mock data

### Key Dependencies
- React 18
- TypeScript 5
- Tailwind CSS 3.3
- Lucide React 0.298
- Date-fns 2.30

## Project Structure

```
review-dash/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── reviews/              # Review-related endpoints
│   │       ├── route.ts          # Main reviews API
│   │       ├── hostaway/         # Hostaway integration
│   │       └── google/           # Google Reviews exploration
│   ├── dashboard/                # Manager dashboard
│   ├── property/[slug]/          # Dynamic property pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   └── ReviewCard.tsx            # Review display component
├── data/                         # Mock data
│   └── mockReviews.json          # Sample review data
├── types/                        # TypeScript types
│   └── review.ts                 # Review interfaces
└── README.md                     # This file
```

## API Endpoints

### GET /api/reviews
Returns all reviews with analytics
- **Query Params**: None
- **Response**: Aggregated review data with analytics

### GET /api/reviews/hostaway
Fetches reviews from Hostaway API
- **Query Params**: `mock=true` (use mock data)
- **Response**: Normalized Hostaway reviews

### PATCH /api/reviews
Updates review approval status
- **Body**: `{ reviewId, isApproved, isPublic }`
- **Response**: Success confirmation

### GET /api/reviews/google
Google Reviews integration exploration
- **Response**: Mock data + integration findings

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your credentials (optional - defaults provided)
   # HOSTAWAY_ACCOUNT_ID=your_account_id
   # HOSTAWAY_API_KEY=your_api_key
   # GOOGLE_PLACES_API_KEY=your_google_api_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Homepage: http://localhost:3000
   - Manager Dashboard: http://localhost:3000/dashboard
   - Property Page: http://localhost:3000/property/2b-n1-a-29-shoreditch-heights
   - API Endpoint: http://localhost:3000/api/reviews/hostaway?mock=true

### Environment Variables
Create a `.env.local` file for production:
```bash
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148
GOOGLE_PLACES_API_KEY=your_google_api_key_here
```

## Key Design Decisions

### 1. API Architecture
- **Hostaway Integration**: Direct API integration with intelligent fallback to mock data
- **Data Normalization**: Consistent review format across all platforms
- **Error Handling**: Graceful degradation when APIs are unavailable

### 2. Review Management
- **Approval Workflow**: Two-stage approval (approved + public visibility)
- **Real-time Updates**: Instant UI updates when changing review status
- **Filtering System**: Comprehensive filtering for large review datasets

### 3. User Experience
- **Manager-focused Dashboard**: Analytics-first design for quick insights
- **Guest-focused Property Pages**: Clean, trustworthy review display
- **Responsive Design**: Works on desktop, tablet, and mobile

### 4. Data Structure
- **Normalized Reviews**: Consistent interface across all platforms
- **Category Ratings**: Support for detailed rating breakdowns
- **Metadata Tracking**: Source, approval status, and visibility flags

## API Behaviors

### Hostaway Integration
1. **Primary**: Attempts to fetch from real Hostaway API
2. **Fallback**: Uses mock data if API is empty or fails
3. **Normalization**: Converts Hostaway format to internal format
4. **Error Handling**: Returns mock data on any API errors

### Review Processing
- **Rating Calculation**: Averages category ratings when overall rating is missing
- **Listing ID Generation**: Converts listing names to URL-friendly IDs
- **Status Mapping**: Maps Hostaway statuses to internal approval states

## Google Reviews Integration Findings

### Feasibility: ✅ POSSIBLE
Google Reviews integration is technically feasible but requires:

### Requirements
- **Google Places API Key** ($17 per 1000 requests after free tier)
- **Place IDs** for each property (one-time setup)
- **Rate Limiting** (1000 requests/day free tier)

### Limitations
- **Read-only Access**: Cannot modify or respond to reviews
- **Limited Filtering**: No date range or advanced filtering
- **Recent Reviews Only**: Limited to most recent reviews
- **No Content Control**: Cannot hide specific reviews

### Implementation Strategy
1. **Place ID Mapping**: Map each property to its Google Place ID
2. **Caching Layer**: Cache reviews to avoid API limits
3. **Batch Processing**: Fetch all property reviews in scheduled jobs
4. **Fallback Data**: Always maintain mock data for development

### Cost Considerations
- **Free Tier**: 1000 requests/day
- **Paid Tier**: $17 per 1000 requests
- **Estimated Monthly Cost**: $50-200 depending on usage

### Alternative: Google My Business API
- **Better Control**: Can respond to reviews
- **Higher Limits**: More generous rate limits
- **Verification Required**: Requires business verification

## Production Considerations

### Performance
- **API Caching**: Implement Redis/memory caching for review data
- **Database**: Move from mock data to PostgreSQL/MongoDB
- **CDN**: Use Vercel/CloudFront for static asset delivery

### Security
- **API Keys**: Secure environment variable management
- **Rate Limiting**: Implement API rate limiting
- **Authentication**: Add manager authentication system

### Monitoring
- **Error Tracking**: Sentry or similar error monitoring
- **Analytics**: Google Analytics or Mixpanel for usage tracking
- **Uptime Monitoring**: Monitor API availability

### Scalability
- **Database Optimization**: Index review queries
- **Background Jobs**: Queue-based review processing
- **Microservices**: Separate review service if needed

## Development Notes

### Mock Data Strategy
The application uses realistic mock data that:
- Simulates real Hostaway API responses
- Includes various rating scenarios (1-5 stars)
- Covers multiple properties and time periods
- Provides category-specific ratings

### Error Handling
- **API Failures**: Graceful fallback to mock data
- **Network Issues**: Retry logic with exponential backoff
- **Data Validation**: TypeScript interfaces ensure data consistency

### Testing Strategy
- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test API endpoints and data flow
- **E2E Tests**: Test complete user workflows

This dashboard provides a solid foundation for review management that can scale with Flex Living's growing property portfolio while maintaining excellent user experience for both managers and guests. 