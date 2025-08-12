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
  const [mostPopularCourses, setMostPopularCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API);
        const category_id = response.data.Allcategories.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]._id;
        setCategoryId(category_id);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    };
    fetchCategories();
  }, [catalogName]);

  // Fetch courses for the selected category
  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          const res = await getCatelogPageData(categoryId);
          if (res?.success) {
            setCatalogPageData(res);
            // Assuming the backend provides fields like 'enrolledStudents' or similar for sorting
            const allCourses = res.data.Selectedcategory.courses;

            // Sort courses for 'Most Popular' tab (example: by students enrolled)
            const sortedByPopularity = [...allCourses].sort((a, b) => b.studentsenrolled.length - a.studentsenrolled.length);
            setMostPopularCourses(sortedByPopularity);

            // Sort courses for 'New' tab (example: by creation date)
            const sortedByDate = [...allCourses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNewCourses(sortedByDate);
          }
        } catch (error) {
          console.log(error);
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

  if (!catalogPageData.success) {
    return <Error />;
  }

  const {
    Selectedcategory,
    Differentcategories,
    MostSellingCourses,
  } = catalogPageData.data;

  return (
    <>
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {Selectedcategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {Selectedcategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {Selectedcategory?.description}
          </p>
        </div>
      </div>

      {/* section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">

        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}>
            Most Popular
          </p>
          <p className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}>
            New
          </p>
        </div>
        {/* courseslider */}
        <div>
          <CourseSlider
            Courses={active === 1 ? mostPopularCourses : newCourses}
          />
        </div>
      </div>

      {/* section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {Differentcategories?.name}
        </div>
        <div className="py-8">
          {/* Slider */}
          <CourseSlider
            Courses={Differentcategories.courses}
          />
        </div>
      </div>

      {/* section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <p className="section_heading">Frequently Bought Courses </p>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {MostSellingCourses?.slice(0, 4).map(
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
