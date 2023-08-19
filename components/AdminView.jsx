import React, { useState, useEffect } from "react";
import { useForm, useFieldArray} from 'react-hook-form';
import axios from 'axios';
import { setAuthToken } from "./setAuthToken";

export default function AdminView(){

    const { register, handleSubmit, control, formState: { errors }, getValues } = useForm();
    const onSubmit = data => console.log(data);
    const token = localStorage.getItem("token");
    const {fields, append, remove} = useFieldArray({control, name: 'receipts'})

    const [ratesResponse, setRatesResponse] = useState([]);

    const [receiptsResponse, setReceiptsResponse] = useState({});
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    useEffect(() => {
        setAuthToken(token);
        axios.get('http://localhost:8080/reimbursement/rates')
            .then(response => {
                setRatesResponse(response.data); 
            })
            .catch(error => {
                console.log(error.response.data);
            });
    }, [token]);

    useEffect(() => {
        setAuthToken(token);
        axios.get('http://localhost:8080/reimbursement/receipts')
            .then(response => {
                setReceiptsResponse(response.data); 
                
            })
            .catch(error => {
                console.log(error.response.data);
            });
    }, [token]);

    const handleSaveChanges = (data) => {
        axios.post('http://localhost:8080/reimbursement/rates', data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSaveDailyAllowance = () => {
        const newData = {
            dailyAllowanceRate: getValues("input_allowance"),
            carMileageRate: ratesResponse.carMileageRate 
        };

        handleSaveChanges(newData);
    };

    const handleSaveCarMileage = () => {
        const newData = {
            dailyAllowanceRate: ratesResponse.dailyAllowanceRate, 
            carMileageRate: getValues("input_mileage")
        };

        handleSaveChanges(newData);
    };

    
    
    
    return (
        
        <form className="Admin_Form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Admin View</h1>
            <div className="Admin_Form_LIST">
                <div className="Admin_Form_Label">Current rate for daily allowance: {ratesResponse.dailyAllowanceRate}$/day </div>
                <div className="Admin_Daily_Allowance">
                    <input  {...register("input_allowance")} className="input_Admin" type="number" placeholder="New rate for daily allowance"></input>
                    <button type="button" className="Admin_Form-Edit" onClick={handleSaveDailyAllowance}>Save</button>
                </div>   
            </div>
            <div className="Admin_Form_LIST">
                <div className="Admin_Form_Label">Current rate for car mileage for 1 km: {ratesResponse.carMileageRate}$/km </div>
                <div className="Admin_Car_Mileage">
                    <input {...register("input_mileage")} className="input_Admin" type="number" placeholder="New rate for car mileage"></input>
                    <button type="button" className="Admin_Form-Edit" onClick={handleSaveCarMileage}>Save</button>
                </div>
            </div>
            <div className="Admin_Form_LIST">
                <label className="Admin_Form_Label">Available receipts</label>
                <div className="Admin_Selector_Wrapper">
                <select className="Admin_Selector" onChange={event => setSelectedReceipt(event.target.value)}>
                    <option value="">Select</option>
                    {receiptsResponse.receipts && receiptsResponse.receipts.map((receipt, index) => (
                        <option key={index} value={receipt.name}>
                            {receipt.name}
                        </option>
                    ))}
                </select>
                    <button type="button" className="Admin_Form-Edit">Save</button>
                </div>
                <div className="Admin_New_Receipts">
                    {fields.map((receipt, index) => (
                        <div key={receipt.id}> 
                            <input type="text"{...register("new_receipt_name")} className="input_receipt" placeholder="Receipt name"></input>
                            <input type="number"{...register("new_receipt_value")} className="input_receipt" placeholder="Receipt value"></input>
                            <button 
                                className='Button_Remove'
                                type="button" 
                                onClick={() => remove(index)}
                                >Remove
                            </button>
                        </div>
                        
                    ))}
                </div>
                <div>
                    {receiptsResponse.receipts && receiptsResponse.receipts.map((receipt, index) => (
                        <div key={index} >
                            <div value={receipt.name}>
                                Name: {receipt.name}
                            </div>
                            <div value={receipt.value}>
                                MaxValue:{receipt.value}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" className="Admin_Form-Edit" onClick={() => append({ name: '', prize: ''})}>New receipt</button>
                
            </div>
        <button className="Admin_Form-submit" type="submit" onClick={handleSaveChanges}>Save Changes to all</button>
        </form>
    )
}