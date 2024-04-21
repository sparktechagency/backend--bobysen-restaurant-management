import { ObjectId } from "mongoose";

interface DaySchedule {
  openingTime: string;
  closingTime: string;
}
export interface TRestaurant {
  [x: string]: any;
  name: string;
  location: string;
  owner: ObjectId;
  isDeleted: boolean;
  images?: string[];
  reviewStatus: boolean;
  description: string;
  totalReviews?: string;
  close?: {
    from: Date;
    to: Date;
  };
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}
