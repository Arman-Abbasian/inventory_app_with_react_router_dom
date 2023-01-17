import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import SearchSelect from "../common/SearchSelect";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineInformationCircle } from "react-icons/hi";
import Input from "../common/Input";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { AiOutlineNumber } from "react-icons/ai";
import { BsPerson,BsFileEarmarkCode } from "react-icons/bs";

const initialValues = {
  requestCode: "",
  personnel: "",
  jobPosition: "",
  whole: "",
  number: "",
  consumingFor: "",
  supplier: "",
  date: "",
  neededDate: "",
};

const validationSchema = Yup.object({
  requestCode: Yup.string().required("request code is required"),
  personnel: Yup.string().required("applicant is required"),
  jobPosition: Yup.string().required("job position code is required"),
  whole: Yup.string().required("product name code is required"),
  number: Yup.number("the format is not number format").required(
    "number is required"
  ),
  consumingFor: Yup.string().required("consuming for is required"),
  supplier: Yup.string().required("supplier is required"),
  date: Yup.date("the format is not date format").required("data is required"),
  neededDate: Yup.date("the format is not date format").required(
    "eeded data is required"
  ),
});

const Purchasing = () => {
  const [personnel, setPersonnel] = useState(null);
  const [jobPosition, setJobPosition] = useState(null);
  const [whole, setWhole] = useState(null);
  const [supplier, setSupplier] = useState(null);

  let navigate = useNavigate();

  const onSubmit = (values, { resetForm }) => {
    axios
      .post(`http://localhost:4000/purchasingReequests`, values)
      .then((res) => {
        navigate("/PurchasingCondition");
        toast.success("purchase request added successfully");
      })
      .catch((err) => toast.error(err.message));
    resetForm();
  };
  
  //get the applicant list from DB
  useEffect(() => {
    axios
      .get(`http://localhost:4000/overall?category=personnel`)
      .then((res) => setPersonnel(res.data))
      .catch((err) => toast.error(err.message));
  }, []);
  //get the job position list from DB
  useEffect(() => {
    axios
      .get(`http://localhost:4000/overall?category=jobPosition`)
      .then((res) => setJobPosition(res.data))
      .catch((err) => toast.error(err.message));
  }, []);
  //get the supplier list from DB
  useEffect(() => {
    axios
      .get(`http://localhost:4000/overall?category=supplier`)
      .then((res) => setSupplier(res.data))
      .catch((err) => toast.error(err.message));
  }, []);
  //get the product name list from DB
  useEffect(() => {
    axios
      .get(`http://localhost:4000/overallProucts`)
      .then((res) => setWhole(res.data))
      .catch((err) => toast.error(err.message));
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
  });
  console.log(formik.errors)
  return (
    <div className="lg:flex-1">
      {personnel && jobPosition && whole && supplier && (
        <form
          onSubmit={formik.handleSubmit}
          className="container mx-auto max-w-md p-2 "
        >
          <div className="flex flex-col gap-4 justify-center items-center">
            <Input
              name="requestCode"
              label="request code"
              formik={formik}
              logo={
                <BsFileEarmarkCode className="w-6 h-6 text-primary_cream" />
              }
            />

            <SearchSelect
              options={personnel}
              name="personnel"
              label="Applicant"
              formik={formik}
              logo={<BsPerson className="w-6 h-6 text-primary_cream" />}
            />
            <SearchSelect
              options={jobPosition}
              name="jobPosition"
              label="job position"
              formik={formik}
              logo={<HiOutlineInformationCircle className="w-6 h-6 text-primary_cream" />}
            />
            <SearchSelect
              options={whole}
              name="whole"
              label="product name"
              formik={formik}
              logo={<HiOutlineShoppingCart className="w-6 h-6 text-primary_cream" />}
            />
            <Input
              type="number"
              label="number"
              name="number"
              formik={formik}
              logo={<AiOutlineNumber className="w-6 h-6 text-primary_cream" />}
            />
            <Input
              label="consuming for"
              name="consumingFor"
              formik={formik}
              logo={<HiOutlineInformationCircle className="w-6 h-6 text-primary_cream" />}
            />

            <SearchSelect
              options={supplier}
              name="supplier"
              label="supplier"
              formik={formik}
              logo={<HiOutlineInformationCircle className="w-6 h-6 text-primary_cream" />}
            />
            <Input
              type="date"
              label="date"
              name="date"
              formik={formik}
              logo={<CiCalendarDate className="w-6 h-6 text-primary_cream" />}
            />
            <Input
              type="date"
              label="needed date"
              name="neededDate"
              formik={formik}
              logo={<CiCalendarDate className="w-6 h-6 text-primary_cream" />}
            />

            <button
              disabled={!formik.isValid}
              className={`py-2 px-4 bg-primary_cream rounded-sm w-full ${!formik.isValid ? 'bg-opacity-60' :'bg-opacity-100'} `}
              type="submit"
            >
              {formik.isValid ? "Add" : "please complete all fields"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Purchasing;

