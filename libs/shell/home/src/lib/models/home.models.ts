export interface HeroContent {
  title: string;
  subtitle: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  imageUrl?: string;
}

export interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  category?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  schedule: string;
}

export interface CommentRequest {
  name: string;
  email: string;
  message: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
}
