import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from 'yup';
import SearchSelect from "../common/SearchSelect";
import SelectOptions from "../common/SelectOptions";
import Input from "../common/Input";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";


const EnterItem = () => {
    const options={productName:[],productSpecification:[],measurmentUnit:[],supplier:[],enterDelivery:[],enterTransferee:[]};
    const [enterItem,setEnterItem]=useState({data:null,error:null,loading:false});
    const [overall,setOverall]=useState(null);
    const {id}=useParams();
    let navigate = useNavigate();
    console.log(id);
    console.log(enterItem.data)
    const initialValues={productName:"",productSpecification:"",measurmentUnit:"",date:"",number:"",supplier:"",enterDelivery:"",enterTransferee:""}
    const onSubmit=(values,{resetForm})=>{
        axios.put(`http://localhost:4000/enter/${id}`,values)
        .then(res=>{
            navigate("/EnterList")
            toast.success("data added successfully")
        })
        .catch(err=>toast.error(err.message));
        resetForm();
    }
    const validationSchema=Yup.object({
        productName:Yup.string().required('product name is required'),
        productSpecification:Yup.string().required('product Specification is required'),
        measurmentUnit:Yup.string().required('measurement Unit is required'),
        date: Yup.date("the format is not date format").required("data is required"),
        number:Yup.number("the format is not number format").required('number is required'),
        supplier:Yup.string().required('supplier is required'),
        enterDelivery:Yup.string().required("delivery is required"),
        enterTransferee:Yup.string().required("transferee is required")
    })
    useEffect(()=>{
        setEnterItem({data:null,error:null,loading:true})
        axios.get(`http://localhost:4000/enter/${id}`)
        .then(res=>{
            setEnterItem({data:res.data,error:null,loading:false});   
        })
        .catch(err=>{
            setEnterItem({data:null,error:err.message,loading:false});
            toast.error(err.message)
        })
    },[]);
    useEffect(()=>{
        axios.get(`http://localhost:4000/overall`)
        .then(res=>{
         setOverall(res.data)
        })
        .catch(err=>toast.error(err.message))
     },[]);
    function fillInputs(){
        initialValues.productName=enterItem.data.productName;
        initialValues.productSpecification=enterItem.data.productSpecification;
        initialValues.measurmentUnit=enterItem.data.measurmentUnit;
        initialValues.date=enterItem.data.date;
        initialValues.number=enterItem.data.number;
        initialValues.supplier=enterItem.data.supplier;
        initialValues.enterDelivery=enterItem.data.enterDelivery;
        initialValues.enterTransferee=enterItem.data.enterTransferee
    }
    if(enterItem.data) {console.log(initialValues)}
    function fillOptions(){
        options.productName= overall.filter(item=>item.category==="productName");
        options.productSpecification= overall.filter(item=>item.category==="productSpecification");
        options.measurmentUnit= overall.filter(item=>item.category==="measurmentUnit");
        options.supplier= overall.filter(item=>item.category==="supplier");
        options.enterDelivery= overall.filter(item=>item.category==="enterDelivery");
        options.enterTransferee= overall.filter(item=>item.category==="enterTransferee");
        console.log(options)
    };
    if(overall) {
        fillOptions()
    }
    const formik=useFormik({initialValues:enterItem.data,onSubmit,validationSchema,validateOnMount:true,enableReinitialize:true});
    
    console.log(options)
    return ( 
        <div>
            {overall && 
            <form onSubmit={formik.handleSubmit} className="container mx-auto max-w-md p-2 ">
                <div className="flex flex-col gap-4 justify-center items-center">
                {options.productName &&
                <SearchSelect options={options.productName} name="productName" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.productSpecification &&
                <SearchSelect options={options.productSpecification} name="productSpecification" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.productName &&
                <SelectOptions options={options.measurmentUnit} name="measurmentUnit" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.productName &&
                <Input type="date" name="date" label="date" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.productName &&
                <Input type="number" label="number" name="number" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.supplier &&
                <SearchSelect options={options.supplier} name="supplier" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.enterDelivery &&
                <SearchSelect options={options.enterDelivery} name="enterDelivery" formik={formik} logo={<CiCalendarDate />} />
                }
                {options.enterTransferee &&
                <SearchSelect options={options.enterTransferee} name="enterTransferee" formik={formik} />
                }
                <button disabled={!formik.isValid} className="py-2 px-4 bg-primary_green rounded-sm w-full" type="submit">{formik.isValid ?'Add' : 'please complete all fields'}</button>
                </div>
            </form>
            }
        </div>
     );

            }
 
export default EnterItem;