const Category = require("../models/Tags");
const Course = require("../models/Course");
const User = require("../models/User");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createcategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const tagdetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("category details---->", tagdetails);
    res.status(200).json({
      success: true,
      message: "Categories created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Category not created",
    });
  }
};

exports.getAllcategories = async (req, res) => {
  try {
    const alltags = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags fetched successfully",
      Allcategories: alltags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching all tags",
    });
  }
};

exports.categorypagedetails = async (req, res) => {
  try {
    const { categoryid } = req.body;
    const selectedcategory = await Category.findById(categoryid)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor", populate: { path: "additionaldetails" } },
          { path: "ratingandreviews" },
        ],
      })
      .exec();

    if (!selectedcategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryid },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: { path: "instructor" },
    }).exec();

    const differentCategory = categoriesExceptSelected.length > 0 
      ? categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)] 
      : null;

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        Selectedcategory: selectedcategory,
        Differentcategories: differentCategory,
        MostSellingCourses: mostSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching category page details",
    });
  }
};
