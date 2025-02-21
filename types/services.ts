export type DayAvailability = {
    start: string
    end: string
  }
  
  export type ServiceAvailability = {
    [key: string]: DayAvailability
  }
  
  export type Service = {
    id: string
    name: string
    description: string
    price: number
    duration: number
    images: string[]
    availability: ServiceAvailability
    status: "active" | "inactive"
  }
  
  