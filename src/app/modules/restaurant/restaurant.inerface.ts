import { ObjectId } from "mongoose";

interface DaySchedule {
  openingTime: string;
  closingTime: string;
}
interface map {
  latitude: number;
  longitude: number;
  coordinates: [number];
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
  avgReviews?: string;
  map: map;
  status: "active" | "inactive";
  helpLineNumber1: String;
  helpLineNumber2?: String;

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
