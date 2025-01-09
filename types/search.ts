export interface Product {
    id: string
    name: string
    description: string
    price: string
    image: string
    category: string
  }
  
  export interface Service {
    id: string
    name: string
    description: string
    category: string
    provider: string
  }
  
  export interface SearchSuggestion {
    id: string
    title: string
    description: string
  }
  
  export interface SearchResults {
    suggestions: SearchSuggestion[]
    products: Product[]
    services: Service[]
  }
  
  