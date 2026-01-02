export interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    isPublished: boolean;
    createdAt: string;
}

export interface GolfCartModel {
    _id: string;
    id?: string; // Support for legacy id if needed
    name: string;
    seating: number;
    tagline: string;
    image: string;
    mrp: string;
    range: string;
    battery: string;
    power: string;
    chargingTime: string;
    tires: string;
    braking: string;
    steering: string;
    lights: string;
    features: string[];
    isActive?: boolean;
    createdAt: string;
}

export interface InquiryNote {
    _id?: string;
    text: string;
    createdAt: string;
}

export interface Inquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    model?: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'rejected';
    assignedTo?: string;
    notes?: InquiryNote[];
    createdAt: string;
    updatedAt?: string;
}
