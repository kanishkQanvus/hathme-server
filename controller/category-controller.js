const categoryModel = require("../model/category-model");
const userMasterModel = require("../model/userMaster-model");
const constants = require("../constants");
const helper = require("../helper/apiHelper");
exports.addCategory = async (req, res) => {
  console.log("category function call");
  try {
    const userId = req.user.userId;
    console.log(userId);
    const data = req.body[constants.APPNAME];
    console.log(data);
    const user = await userMasterModel.findById({ _id: userId });
    if (user.userType == 1) {
      const categoryExist = await categoryModel.findOne({ name: data.name });
      console.log(categoryExist, "categoryExist");
      if (categoryExist) {
        console.log("fsdfdfa");
        return res.json(helper.generateServerResponse(0, 117));
      }
      const category = await categoryModel.create(data);
      console.log(category, "category");
      return res.json(helper.generateServerResponse(1, 118));
    }
    res.json(helper.generateServerResponse(0, 119));
  } catch (error) {
    res.json(helper.generateServerResponse(0, 105));
  }
};
exports.allCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find();
    console.log(allCategory);
    if (allCategory.length > 0) {
      allCategory.forEach((value) => {
        value.image = value.image
          ? process.env.CATEGORIESIMAGE + `${value.image}`
          : "";
      });
      return res.json(helper.generateServerResponse(1, 120, allCategory));
    }
    res.json(helper.generateServerResponse(0, 121));
  } catch (error) {
    res.json(helper.generateServerResponse(0, 105));
  }
};

exports.searchCategory = async (req, res) => {
 
  let { search } = req.query;
  console.log(search,"search")
  const query = { name: { $regex: search, $options: "i" } };
  let searchCategory = await categoryModel.find(query);
  console.log(searchCategory)
  if(searchCategory.length<=0){return res.json(helper.generateServerResponse(0, 168));}
  searchCategory.forEach((value) => {
    value.image = value.image
      ? process.env.CATEGORIESIMAGE + `${value.image}`
      : " ";
  });
  res.json(helper.generateServerResponse(1, 122, searchCategory));
};
