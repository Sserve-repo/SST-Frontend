export interface ServiceAreaAvailability {
    id?: number
    user_id?: number
    available_dates: string[]
    start_time: string
    end_time: string
    longitude: string
    latitude: string
    home_service_availability: string
    service_duration?: string
    created_at?: string
    updated_at?: string
}

export interface BusinessPolicy {
    id?: number
    user_id?: number
    booking_details: string
    cancelling_policy: string
    created_at?: string
    updated_at?: string
}

export interface ShippingPolicy {
    id?: number
    user_id?: number
    shipping_option: string
    from_date: number
    to_date: number
    return_policy: string
    shipping_cost: string
    created_at?: string
    updated_at?: string
}

export interface VendorIdentity {
    id?: number
    user_id?: number
    document_type: string
    document: string | File
    created_at?: string
    updated_at?: string
}

export interface ServiceAreaAvailabilityData {
    available_dates: string[]
    start_time: string
    end_time: string
    longitude: string
    latitude: string
    home_service_availability: string
    service_duration?: string
}

export interface BusinessPolicyData {
    booking_details: string
    cancelling_policy: string
}

export interface ShippingPolicyData {
    shipping_option: string
    from_date: string
    to_date: string
    return_policy: string
    shipping_cost: string
}

export interface VendorIdentityData {
    document_type: string
    document: File
}

export interface BusinessDetails {
    id?: number
    user_id?: number
    business_details: string
    business_email: string
    business_phone: string
    business_name: string
    product_category_id: string
    product_region_id: string
    city: string
    province_id: string
    postal_code: string
    created_at?: string
    updated_at?: string
}

export interface BusinessDetailsData {
    business_details: string
    business_email: string
    business_phone: string
    business_name: string
    product_category_id: string
    product_region_id: string
    city: string
    province_id: string
    postal_code: string
}
