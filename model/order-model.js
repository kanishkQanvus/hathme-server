const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    orderId: {
      type: String,
      required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    addToCartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    couponApplied: {
        type: String,  // 1 = yes coupon applied, 2= No coupon applied
        required: true,
    },
    couponCode: {
        type: String,

    },
    tip: {
        type: Number,
    },
    totalAmount: {
        type: String,
    },

    discount: {
        type: Number,
    },
    flat: {
        type: Number,
    },
    delivery: {
        type: Number
    },
    toPay: {
        type: Number,
        required: true,
    },
    finalAmount: {
        type: String,
    },
    status: {
        type: String,   // 1=pending for approval ,2=  accept   ,3=cancel  , 4 -> picked up, 5 -> delivered                
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    acceptedAt: {
        type: Date,
    },
    suggestion: {
        type: String,
    },
    deliveryFeePerKm: {
        type: String,
        default: 5
    },
    totalDeliveryCharges: {
        type: String,
    },
    distance: {
        type: String
    },
    taxesAndCharges: {
        type: String
    },
    paymentStatus: {
        type: Number,
        default: 1     // 1= payment status
    },
    orderState: {
        type: String,
        //0-> not accepted  1 -> preparing , 2-> ready 
    },
    orderStar: {
        type: Number,
        default: 0      // number of stars

    },
    paymentMethod: {
        type: Number,
        default: 1             // 1 = not paid
    },
    products: [],
    mercToCustRating: {
      orderStar: {
        type: Number,
        default: 0
      },
      comment: {
        type: String
      }
    },
    custToMercRating: {
      orderStar: {
        type: Number,
        default: 0
      },
      comment: {
        type: String
      }
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,      
    }

}, { timestamps: true })


module.exports = mongoose.model("orders", orderSchema)



// settting table