import { ObjectId } from "mongoose";

interface DaySchedule {
  openingTime: string;
  closingTime: string;
}
interface map {
  latitude: number;
  longitude: number;
  coordinates: [number];
  type: { type: string };
}
export interface TRestaurant {
  [x: string]: any;
  name: string;
  address: string;
  owner: ObjectId;
  isDeleted: boolean;
  images?: string[];
  reviewStatus: boolean;
  description: string;
  avgReviews?: string;
  location: map;
  status: "active" | "inactive";
  helpLineNumber1: String;
  helpLineNumber2?: String;
  isClosed: boolean;
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
