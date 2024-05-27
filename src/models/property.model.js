import { mongoose } from 'mongoose';


const PropertySchema = new mongoose.Schema(

    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image:{
            type: [String],
            index: true,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        cityName: {
            type: String,
            required: true
        },
        districtName: {
            type: String,
            required: true
        },
        pincode:{
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        bedrooms:
        {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        kitchen: {
            type: Number,
            required: true
        },
        nearbyFacilities: {
            type: [String],
            required: true,
            index: true,
        },
        price: {
            type: Number,
            required: true
        },
        likeCount: { 
        type: Number,
        default: 0 },
        likedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ]

    },
    {
    timestamps: true
});


export const Property = mongoose.model('Property', PropertySchema);

