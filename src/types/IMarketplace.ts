interface User {
  _id: string;
  username: string;
  profile_picture: string;
}

interface LocationData {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface MarketplaceProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  location: LocationData;
  images: string[];
  isBlocked: boolean;
  userId: User;
  createdAt: string;
  updatedAt: string;
  isPromoted: boolean;
  promotionExpiry?: string;
  isApproved:boolean;
  __v: number;
}

export interface CreateProductDTO {
  title: string;
  price: number;
  category: string;
  location: LocationData;
  description: string;
}
