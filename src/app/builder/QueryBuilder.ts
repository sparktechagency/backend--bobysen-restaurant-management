import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private exclusions: string[] = [];
  private populatedFields: string | null = null;
  private pipeline: any[] = [];

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.pipeline.push({
        $match: {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          })),
        },
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "latitude",
      "longitude",
      "distance",
    ];

    excludeFields.forEach((el) => delete queryObj[el]);

    this.pipeline.push({
      $match: queryObj as FilterQuery<T>,
    });

    return this;
  }

  geospatial() {
    const { latitude, longitude, distance = 5000 } = this.query;
    console.log("From Query", latitude, longitude);

    if (latitude && longitude) {
      const maxDistance = parseFloat(distance as string) * 1609; // Convert miles to meters

      this.pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(longitude as string),
              parseFloat(latitude as string),
            ],
          },
          key: "map", // Assuming "map" is the object holding latitude and longitude
          distanceField: "dist.calculated",
          maxDistance: maxDistance,
          spherical: true,
        },
      });
    }

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip }, { $limit: limit });

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
