import { lazy } from 'react';

// Landing page components (these are likely default exports)
export const Hero = lazy(() => import('@/components/landing/Hero'));
export const Section2 = lazy(() => import('@/components/landing/Section2'));
export const Section7 = lazy(() => import('@/components/landing/Section7'));
export const Section8 = lazy(() => import('@/components/landing/Section8'));
export const Section9 = lazy(() => import('@/components/landing/Section9'));
export const FeaturedProducts = lazy(() => import('@/components/landing/featured-products'));
export const FeaturedServices = lazy(() => import('@/components/landing/featured-services'));
export const RecommendedVendors = lazy(() => import('@/components/landing/recommended-vendors'));
export const RecommendedArtisans = lazy(() => import('@/components/landing/recommended-artisans'));

// Loading fallback component
export const ComponentLoader = ({ className = "h-32 w-full" }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#502266]"></div>
  </div>
);

// Skeleton components for better UX
export const CardSkeleton = () => (
  <div className="rounded-lg border p-6 space-y-4">
    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
);
