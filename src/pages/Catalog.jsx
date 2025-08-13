import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/api";
import getCatelogPageData from "../services/operations/pageAndComponentData";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useSelector } from "react-redux";
import CourseCard from "../components/core/Catalog/Course_Card";
import Error from "./Error";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories to get the category ID
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API);
        
        // Ensure data and Allcategories exist before filtering
        if (response?.data?.Allcategories) {
          const category_id = response.data.Allcategories.filter(
            (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
          )?.[0]?._id; // Using optional chaining for safety
          setCategoryId(category_id);
        }
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    };
    fetchCategories();
  }, [catalogName]);

  // Fetch catalog page data after getting the category ID
  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          const res = await getCatelogPageData(categoryId);
          setCatalogPageData(res);
        } catch (error) {
          console.log(error);
          setCatalogPageData({ success: false }); // Set a flag to show error page
        }
      })();
    }
  }, [categoryId]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Handle API failure by rendering the Error component
  if (!catalogPageData?.success) {
    return <Error />;
  }

  return (
    <>
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.Selectedcategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.Selectedcategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.Selectedcategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        {/* Course Slider */}
        <div>
          <CourseSlider
            Courses={catalogPageData?.data?.Selectedcategory?.courses}
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.Differentcategories?.name}
        </div>
        <div className="py-8">
          {/* Slider */}
          <CourseSlider
            Courses={catalogPageData?.data?.Differentcategories?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <p className="section_heading">Frequently Bought Courses</p>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.data?.MostSellingCourses?.slice(0, 4).map(
              (course, index) => (
                <CourseCard
                  course={course}
                  key={index}
                  Height={"h-[400px]"}
                />
              )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Catalog;
