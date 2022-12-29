import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import OneInventoryItem from "../components/OneInventoryItem";
import FilterInventory from "../components/FilterInventory";
import { useParams } from "react-router-dom";

const InventoryDetail = () => {
    const [productNames,setProductNames]=useState({data:null,error:null,loading:false});
    const [enters,setEnters]=useState({data:null,error:null,loading:false});
    const [exits,setExits]=useState({data:null,error:null,loading:false});
    const [inventoryItem,setInentoryItem]=useState(null);
const {id}=useParams();

    //1- fill 3 state at first with data from DB
    useEffect(()=>{
        axios.get(`http://localhost:4000/overall/${id}`)
        .then(res=>{
            setProductNames(res.data);
            getEnterFromDB();
            getExitFromDB()
        })
        .catch(err=>toast.error(err.message))
    },[]);

    if(productNames.data && enters.data && exits.data && !inventoryItem){
        setWholeItems()
    };

    //get enter item from DB
    async function getEnterFromDB(){
        setEnters({data:null,error:null,loading:true})
        try {
        const {data}= await axios.get(`http://localhost:4000/enter?productName=${productNames.data.productName}`) 
        setEnters({data:data,error:null,loading:false})
        } catch (err) {
            setEnters({data:null,error:err.message,loading:false})
          toast.error(err.message)  
        }
    };
    //get exits item from DB
    async function getExitFromDB(){
        setExits({data:null,error:null,loading:true})
        try {
        const {data}= await axios.get(`http://localhost:4000/exit?productName=${productNames.data.productName}`) 
        setExits({data:data,error:null,loading:false})
        } catch (err) {
            setExits({data:null,error:err.message,loading:false})
          toast.error(err.message)  
        }
    };
        function setWholeItems(){
            const enterItems=enters.data.filter(element=>element.productName===productNames.data.productName);
            const sumEnters = enterItems.reduce((accumulator, currentValue) => accumulator + currentValue.number,0) || 0;
            const exitItems=exits.data.filter(element=>element.productName===productNames.data.productName);
            const sumExits = exitItems.reduce((accumulator, currentValue) => accumulator + currentValue.number,0) || 0;
            let condition=""
            if((sumEnters - sumExits)>=productNames.data.orderPoint) {condition="ok"}
            else if((sumEnters - sumExits)< productNames.data.safetyStock) {condition="danger"}
            else if((sumEnters - sumExits)<productNames.data.orderPoint) {condition="warning"}
            setInentoryItem({...productNames.data,numberOfEnter:sumEnters,numberOfExit:sumExits,condition:condition})
};


    return ( 
        <div className="flex flex-col gap-y-4 lg:flex-1">
            {inventoryItem && 
                <OneInventoryItem key={inventoryItem.id} productName={inventoryItem.productName} measurmentUnit={inventoryItem.measurmentUnit} enter={inventoryItem.numberOfEnter} exit={inventoryItem.numberOfExit} safetyStock={inventoryItem.safetyStock} orderPoint={inventoryItem.orderPoint} />
            }
        </div>
     );
};
export default InventoryDetail;