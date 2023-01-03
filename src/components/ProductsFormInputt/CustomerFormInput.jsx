import { useFormik } from "formik";
import * as Yup from 'yup';
import Input from "../../common/Input";
import Textarea from "../../common/Textarea";
import {  HiOutlineInformationCircle } from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


const CustomerFormInput = () => {
    const [isShow,setIsShow]=useState(false);

    const initialValues={customerName:"",information:""}
    const onSubmit=(values,{ resetForm })=>{
        axios.post(`http://localhost:4000/customer`,values)
        .then(res=>{
            toast.success(`data added successfully`);
            setIsShow(false)
        })
        .catch(err=>toast.error(err.message))
        resetForm();      
};

    const validationSchema=Yup.object({
        customerName:Yup.string().required(`customer name is required`),
        information:Yup.string(),
    });

    const formik=useFormik({initialValues,onSubmit,validationSchema,validateOnMount:true});
    return ( 
        <div className="flex flex-col gap-3 container mx-auto max-w-md p-2">
            <button className={`w-full p-2 rounded-sm bg-primary_yellow`}onClick={()=>setIsShow(!isShow)}>{isShow ?'hide customer name' : 'show customer name'}  input</button>
            <form onSubmit={formik.handleSubmit} className={`${isShow ? 'block':'hidden'}`}>
                <div className="flex flex-col gap-4 justify-center items-center border border-primary_green  rounded-sm p-2">
                    <Input  name="customerName" label="customer name" formik={formik} logo={<HiOutlineInformationCircle className="w-6 h-6" />} />
                    <Textarea name="information" label="information" formik={formik} logo={<HiOutlineInformationCircle className="w-6 h-6" /> }/>
                    <button disabled={!formik.isValid} className="py-2 px-4 bg-primary_yellow rounded-sm w-full disabled:bg-opacity-60" type="submit">{formik.isValid ? 'Add':'please fill necessary fields'}</button>
                </div>
            </form>
        </div>
     );
}
export default CustomerFormInput;