import { ObjectId } from 'mongodb';

export interface User {
    _id: ObjectId;
    email: string;
    passwordHash?: string;
    name: string;
    googleId?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RefreshToken {
    _id: ObjectId;
    token: string;
    userId: ObjectId;
    expiresAt: Date;
    createdAt: Date;
}

export interface TokenPayload {
    userId: string;
    email: string;
}


// ... keep existing interfaces

export interface Plan {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    shortDescription: string;
    fullDescription: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedHours: number;
    imageUrl?: string;
    modules?: Array<{ title: string; topics: string[] }>;
    aiGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    _id: ObjectId;
    planId: ObjectId;
    userId: ObjectId;
    rating: number; // 1-5
    comment: string;
    createdAt: Date;
}