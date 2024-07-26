"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// QueryBuilder class
class AgreegationBuilder {
    constructor(model, query) {
        this.model = model;
        this.query = query;
        this.pipeline = [];
    }
    geospatial() {
        if (this.query.latitude && this.query.longitude) {
            console.log(this.query);
            // Ensure latitude and longitude are parsed correctly
            const longitude = parseFloat(this.query.longitude);
            const latitude = parseFloat(this.query.latitude);
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
    search(fields) {
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
    filter() {
        const queryObj = Object.assign({}, this.query);
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
    fields() {
        if (this.query.fields) {
            const project = this.query.fields.split(",").reduce((acc, field) => {
                acc[field] = 1;
                return acc;
            }, {});
            this.pipeline.push({ $project: project });
        }
        return this;
    }
    sort() {
        if (this.query.sort) {
            const sortStage = this.query.sort.split(",").reduce((acc, field) => {
                const [key, order] = field.split(":");
                acc[key] = order === "desc" ? -1 : 1;
                return acc;
            }, {});
            this.pipeline.push({ $sort: sortStage });
        }
        return this;
    }
    paginate() {
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
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.aggregate(this.pipeline);
            // Count total
            const countPipeline = this.pipeline.filter((stage) => !("$skip" in stage) && !("$limit" in stage));
            countPipeline.push({ $count: "total" });
            const metaResult = yield this.model.aggregate(countPipeline);
            const meta = metaResult[0] ? metaResult[0].total : 0;
            return { data, meta };
        });
    }
}
exports.default = AgreegationBuilder;
