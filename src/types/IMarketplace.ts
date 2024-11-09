interface User {
  _id: string;
  username: string;
  profile_picture: string;
}

export interface MarketplaceProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  location: string;
  images: string[];
  isBlocked: boolean;
  userId: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
  export interface CreateProductDTO {
    title: string;
    price: number;
    category: string;
    location: string;
    description: string;
  }