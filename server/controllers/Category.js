const Category = require("../models/Category");

// Handler function to create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handler function to show all categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      Allcategories: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handler function to get all courses for a specific category
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    // Handle case where category is not found
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    // Handle case where no courses are found for the category
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        data: {
          Selectedcategory: selectedCategory,
        },
      });
    }

    const selectedCourses = selectedCategory.courses;
    
    return res.status(200).json({
      success: true,
      data: {
        Selectedcategory: selectedCategory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
