export type ServiceType = 'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'general';

export interface ServiceProvider {
    id: string;
    name: string;
    serviceType: ServiceType;
    pricePerHour: number;
    duration: number;
    location: string;
    rating: number;
}

export interface ScheduleRequest {
    date: Date | undefined;
    time: string;
    serviceType: ServiceType | null;
    location: string | null;
}