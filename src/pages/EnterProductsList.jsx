import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FilterEnters from "../components/FilterEnters";
import OneEnterItem from "../components/OneEnterItem";

const EnterProductsList = () => {
  const [enterProductsList, setEnterProductsList] = useState({
    data: null,
    error: null,
    loading: false,
  });

  const [filters, setFilters] = useState({
    latest: true,
    productName: "",
    supplier: "",
    enterDelivery: "",
    enterTransferee: "",
  });

  useEffect(()=>{
    setEnterProductsList({data:null,error:null,loading:true})
    axios.get(`http://localhost:4000/allEnterProducts`)
    .then(res=>setEnterProductsList({data:res.data,error:null,loading:false}))
    .catch(err=>{
        toast.error(err.message);
        setEnterProductsList({data:null,error:err.message,loading:false})
    })
  },[])

  return (
    <div className="lg:flex-1">
      {/* <FilterEnters
        filters={filters}
        changeHandler={changeHandler}
        toggleChangeHandler={toggleChangeHandler}
      /> */}
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {enterProductsList.data &&
          enterProductsList.data.map((item) => (
            <OneEnterItem
              key={item.id}
              productName={item.whole}
              number={item.productNumber}
              date={item.date}
            />
          ))}
      </div>
    </div>
  );
};

export default EnterProductsList;