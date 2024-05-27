import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,

} from "../controllers/user.controller.js";

import {
    addProperty ,
    getAllProperties,
    getsellerProperty,
    getPropertyByID,
    updateProperty,
    deleteProperty,
    likeProperty,
    registerInterest,
    PropertyDetailsById,
    getphoneno,
    getLikedProperties

} from "../controllers/property.controller.js"


import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


//unsecured routes
router.route("/properties-list").get(getAllProperties)
router.route("/property-details/:id").get( PropertyDetailsById );




//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)



//secured routes for sellers
router.route("/add").post(verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 5
        }, 
    ]),
    addProperty
)

router.route("/my-properties").get( verifyJWT,getsellerProperty);
router.route("/property/:id").get( verifyJWT, getPropertyByID );

router.route("/update-property/:id").put( verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 5
        }, 
    ]),
 updateProperty);
router.route("/delete-property/:id").delete( verifyJWT, deleteProperty);
router.route("/interested/:id").post( verifyJWT, registerInterest);
router.route("/like/:id").post(verifyJWT, likeProperty);
router.route("/liked-properties").get(verifyJWT, getLikedProperties);
router.route("/property/:propertyId/seller-phone").get(verifyJWT,getphoneno);






export default router