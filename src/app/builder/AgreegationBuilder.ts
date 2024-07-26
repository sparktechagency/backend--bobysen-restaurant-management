import { Model, PipelineStage } from "mongoose";

// Define the query interface
interface Query {
  searchTerm?: string;
  filter?: Record<string, any>;
  longitude?: number;
  latitude?: number;
  distance?: number;
  fields?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

// QueryBuilder class
class AgreegationBuilder<T> {
  private model: Model<T>;
  private query: Query;
  private pipeline: PipelineStage[];

  constructor(model: Model<T>, query: Query) {
    this.model = model;
    this.query = query;
    this.pipeline = [];
  }
  geospatial(): this {
    if (this.query.latitude && this.query.longitude) {
      console.log(this.query);

      // Ensure latitude and longitude are parsed correctly
      const longitude = parseFloat(this.query.longitude as unknown as string);
      const latitude = parseFloat(this.query.latitude as unknown as string);

      if (isNaN(longitude) || isNaN(latitude)) {
        throw new Error("Invalid latitude or longitude values");
      }

      this.pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          key: "map", // Make sure the field 'map' exists in your documents and is indexed with a 2dsphere index
          maxDistance: 5000 * 1609, // Max distance in meters
          distanceField: "dist.calculated",
          spherical: true,
        },
      });
    }
    return this;
  }
  search(fields: string[]): this {
    if (this.query.searchTerm) {
      const searchRegex = { $regex: this.query.searchTerm, $options: "i" };
      this.pipeline.push({
        $match: {
          $or: fields.map((field) => ({ [field]: searchRegex })),
        },
      });
    }
    return this;
  }

  filter(): this {
    const queryObj: Record<string, any> = { ...this.query };
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
    this.pipeline.push({ $match: queryObj });

    return this;
  }

  fields(): this {
    if (this.query.fields) {
      const project = this.query.fields.split(",").reduce((acc: any, field) => {
        acc[field] = 1;
        return acc;
      }, {});
      this.pipeline.push({ $project: project });
    }
    return this;
  }

  sort(): this {
    if (this.query.sort) {
      const sortStage = this.query.sort.split(",").reduce((acc: any, field) => {
        const [key, order] = field.split(":");
        acc[key] = order === "desc" ? -1 : 1;
        return acc;
      }, {});
      this.pipeline.push({ $sort: sortStage });
    }
    return this;
  }

  paginate(): this {
    const limit = this.query.limit
      ? parseInt(String(this.query.limit), 10)
      : 10;
    const skip = this.query.page
      ? (parseInt(String(this.query.page), 10) - 1) * limit
      : 0;
    this.pipeline.push({ $skip: skip });
    this.pipeline.push({ $limit: limit });
    return this;
  }

  async execute(): Promise<{ data: T[]; meta: number }> {
    const data = await this.model.aggregate(this.pipeline);

    // Count total
    const countPipeline = this.pipeline.filter(
      (stage) => !("$skip" in stage) && !("$limit" in stage)
    );
    countPipeline.push({ $count: "total" });

    const metaResult = await this.model.aggregate(countPipeline);
    const meta = metaResult[0] ? metaResult[0].total : 0;

    return { data, meta };
  }
}

export default AgreegationBuilder;
