import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Property } from "../models/property.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";


// Add property
const addProperty = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        place,
        area,
        cityName,
        districtName,
        pincode,
        country,
        bedrooms,
        bathrooms,
        kitchen,
        price,
        nearbyFacilities
    } = req.body;

    const sellerId = req.user._id;

    if(req.user.role !== "seller"){

        throw new ApiError(400, "You are not a seller to Add a property change your profile role to the Add property");
    }

    // Check if all required fields are provided and not empty
    const requiredFields = {
        title,
        description,
        place,
        area,
        cityName,
        districtName,
        pincode,
        country,
        bedrooms,
        bathrooms,
        kitchen,
        price,
        nearbyFacilities
    };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            throw new ApiError(400, `${key} is required`);
        }
    }

    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Property image file is required");
    }

    const propertyImage = await uploadOnCloudinary(imageLocalPath);

    if (!propertyImage) {
        throw new ApiError(400, "Failed to upload property image");
    }

    const newProperty = await Property.create({
        sellerId,
        image: propertyImage.url,
        title,
        description,
        place,
        area,
        cityName,
        districtName,
        pincode,
        country,
        bedrooms,
        bathrooms,
        kitchen,
        price,
        nearbyFacilities
    });

    if (!newProperty) {
        throw new ApiError(500, "Something went wrong while registering the property");
    }

    return res.status(201).json(
        new ApiResponse(201, newProperty, "Property added successfully")
    );
});

 // Get all listed properties
const getAllProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find();

    if (!properties) {
        throw new ApiError(404, "No properties found");
    }

    return res.status(200).json(
        new ApiResponse(200, properties, "Properties retrieved successfully")
    );
});

const getPropertyByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the property by ID
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

});

const PropertyDetailsById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the property by ID
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

});

const getphoneno = asyncHandler(async (req, res) => {
    try {
        const { propertyId } = req.params;

        // Find the property by ID
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Find the seller by ID
        const seller = await User.findById(property.sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Return the seller's phone number
        res.json({ phoneNo: seller.phoneno });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
)

// Get all listed properties of seller
 const getsellerProperty = asyncHandler(async (req, res) => {
    const properties = await Property.find({sellerId: req.user._id});

    if (!properties) {
        throw new ApiError(404, "No properties found");
    }

    return res.status(200).json(
        new ApiResponse(200, properties, "Properties retrieved successfully")
    );
 }
);

//update properties of seller

// Update property
const updateProperty = asyncHandler(async (req, res) => {

   
    const {
        title,
        description,
        place,
        area,
        cityName,
        districtName,
        pincode,
        country,
        bedrooms,
        kitchen,
        price,
        bathrooms,
        nearbyFacilities
    } = req.body;

    const propertyId = req.params.id;
    const sellerId = req.user._id;

    if(req.user.role !== "seller"){

        throw new ApiError(400, "You are not a seller to Update a property!! change your profile role to the Update a property");
    }

    // Dynamically build the update object
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (place !== undefined) updates.place = place;
    if (area !== undefined) updates.area = area;
    if (cityName !== undefined) updates.cityName = cityName;
    if (districtName !== undefined) updates.districtName = districtName;
    if (pincode !== undefined) updates.pincode = pincode;
    if (country !== undefined) updates.country = country;
    if (bedrooms !== undefined) updates.bedrooms = bedrooms;
    if (bathrooms !== undefined) updates.bathrooms = bathrooms;
    if (kitchen !== undefined) updates.kitchen = kitchen;
    if (price !== undefined) updates.bathrooms = price;
    if (nearbyFacilities !== undefined) updates.nearbyFacilities = nearbyFacilities;

    // Handle image update if provided
    if (req.files?.image?.[0]?.path) {
        const imageLocalPath = req.files.image[0].path;
        const propertyImage = await uploadOnCloudinary(imageLocalPath);
        if (propertyImage) {
            updates.image = propertyImage.url;
        } else {
            throw new ApiError(400, "Failed to upload property image");
        }
    }

    const updatedProperty = await Property.findOneAndUpdate(
        { _id: propertyId, sellerId: sellerId },
        { $set: updates },
        { new: true }
    );

    if (!updatedProperty) {
        throw new ApiError(404, "Property not found or you're not authorized to update this property");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProperty, "Property updated successfully")
    );
});

const deleteProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const sellerId = req.user._id;


    // Check if the user is a seller
    if (req.user.role !== "seller") {
        throw new ApiError(400, "Only sellers can delete property");
    }

    // Check if the property belongs to the seller
    const property = await Property.findOne({ _id: propertyId, sellerId });
    if (!property) {
        throw new ApiError(404, "Property not found or you're not authorized to delete this property");
    }

    // Delete the property
    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json(
        new ApiResponse(200, null, "Property deleted successfully")
    );
});


//like property
const likeProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user._id;

    // Find the property
    const property = await Property.findById(propertyId);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Check if the user has already liked the property (optional step to prevent multiple likes)
    if (property.likedBy && property.likedBy.includes(userId)) {
        throw new ApiError(400, "You have already liked this property");
    }
    // Increment the like count
    property.likeCount = (property.likeCount || 0) + 1;

    // Add user to likedBy array (optional)
    property.likedBy = property.likedBy || [];
    property.likedBy.push(userId);

    await property.save();

    return res.status(200).json(
        new ApiResponse(200, property, "Property liked successfully")
    );
});


// Get all properties liked by the user
const getLikedProperties = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find all properties liked by the user
    const likedProperties = await Property.find({ likedBy: userId });

    if (!likedProperties.length) {
        return res.status(404).json(new ApiResponse(404, null, "No liked properties found"));
    }

    return res.status(200).json(
        new ApiResponse(200, likedProperties, "Liked properties retrieved successfully")
    );
});

// Register interest in a property
const registerInterest = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const buyerId = req.user._id;

    // Find the property and populate the seller details
    const property = await Property.findById(propertyId).populate('sellerId');
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Find the buyer details
    const buyer = await User.findById(buyerId);
    if (!buyer) {
        throw new ApiError(404, "Buyer not found");
    }

    const seller = property.sellerId;

   
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });


    // Email options for the seller
    const mailOptionsSeller = {
        from: 'your-email@gmail.com',
        to: seller.email,
        subject: 'Property Interest',
        text: `Buyer ${buyer.fullName} is interested in your property. Contact details: ${buyer.phoneno} or ${buyer.email}`
    };

    // Email options for the buyer
    const mailOptionsBuyer = {
        from: 'your-email@gmail.com',
        to: buyer.email,
        subject: 'Property Interest',
        text: `You showed interest in ${property.title}. Contact seller at ${buyer.phoneno} or ${seller.email}`
    };

    // Send emails to both seller and buyer
    await transporter.sendMail(mailOptionsSeller);
    await transporter.sendMail(mailOptionsBuyer);

    return res.status(200).json(
        new ApiResponse(200, null, "Interest registered and emails sent")
    );
});



export {

    addProperty,
    getAllProperties,
    getPropertyByID,
    getsellerProperty,
    updateProperty,
    deleteProperty,
    likeProperty,
    PropertyDetailsById,
    registerInterest,
    getLikedProperties,
    getphoneno

    }