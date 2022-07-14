const mongoose = require("mongoose");
const validator = require("validator");


const coupanSchema = new mongoose.Schema({

  couponCode: {
    type: String,
    required: true,
     
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
  categoryId: {  //1=single,2=multiple  
    type: mongoose.Types.ObjectId,
  },
  amount: {
    type: Number,   //if type 1= it's menas is a percentage   type=2 it is flat price
    // required: true,
  
  },

  maxDiscount:{
    type:String

  },
  expireDate: {
    type: Date,
    // required: true,
 
  },
  type:{
    type:String,    //1=PERCENTAGE   2 = FLATE
   
  },
  minPriceForApplyCoupon:{type:Number},
  maxPriceForApplyCoupon:{type:Number},

 
   isActive: { type: String, require: true, default: 1 }
  
});

module.exports = mongoose.model("coupon", coupanSchema);





// coupan_code:
//     { 
//        type:String,
//        require:true
//   },
//    userId: {
//     type: mongoose.Types.ObjectId,
//     required: true,
//     ref: "userMaster",
//   },
//     type: {type:String, require: true},
  
    
//     amount: { type: Number, required: true },
//     expireDate: { type: String, require: true, default: "" },
//     isActive: { type: String, require: true, default: 1 },
//     category_id: { type:mongoose.Types.ObjectId, require: true, },
//     createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now(),
//   },