import React, { useState, useEffect } from "react";
import { useForm, useFieldArray} from 'react-hook-form';
import axios from 'axios';
import { setAuthToken } from "../setAuthToken";
import { getUserTypeFromToken } from "../getUserTypeFromToken";

export default function AdminView(){

    const { register, handleSubmit, control, formState: { errors }, getValues } = useForm();
    const onSubmit = data => console.log(data);
    const token = localStorage.getItem("token");
    const {fields, append, remove} = useFieldArray({control, name: 'receipts'})

    const [ratesResponse, setRatesResponse] = useState([]);
    const [receiptsResponse, setReceiptsResponse] = useState({});
    const [limitsResponse, setLimitsResponse] = useState({});
    const [shouldRender, setShouldRender] = useState(false);
    const [editingReceiptIndex, setEditingReceiptIndex] = useState(-1);

    const handleEditReceipt = (index) => {
        setEditingReceiptIndex(index);
    };



    const userType = getUserTypeFromToken();

    useEffect(() => {
        if (userType === 'ADMIN') {
          setShouldRender(true);
        } else if (userType === 'USER') {
          window.location.href = '/HomePage'; 
        } else {
          window.location.href = '/Login'; 
        }
      
        setAuthToken(token);
        Promise.all([
          axios.get('http://localhost:8080/reimbursement/rates'),
          axios.get('http://localhost:8080/reimbursement/receipts'),
          axios.get('http://localhost:8080/reimbursement/limits')
        ])
          .then(([ratesResponse, receiptsResponse, limitsResponse]) => {
            setRatesResponse(ratesResponse.data);
            setReceiptsResponse(receiptsResponse.data);
            setLimitsResponse(limitsResponse.data);
            console.log(limitsResponse.data)
          })
          .catch(error => {
            console.log(error.response.data);
          });
      }, [token, userType]);

   

    const handleSaveChanges = (data) => {
        axios.post('http://localhost:8080/reimbursement/rates', data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleSaveLimit = (property, newValue) => {
        const newData = {
            ...limitsResponse,
            [property]: newValue
        };
    
        axios.post('http://localhost:8080/reimbursement/limits', newData)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log('Error saving limit:', error);
            });
    }
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
    const handleSaveNewReceipt = () => {
        fields.forEach((field, index) => {
            const newData = {
                name: getValues(`new_receipt_name.${index}`),
                value: getValues(`new_receipt_value.${index}`)
            };
    
            axios.post('http://localhost:8080/reimbursement/receipts', newData)
                .then(function (response) {
                    console.log(response);
                    setReceiptsResponse(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    };

    const handleDeleteReceiptBackend = (receiptName) => {
        
            axios.delete(`http://localhost:8080/reimbursement/receipts/${receiptName}`, {
            }).then(function(response){
                console.log(response)
                setReceiptsResponse(response.data)
            })
            .catch (function(error) {
                console.log(error);
            })
    };

    const handleSaveEditedReceipt = (name) => {
        const updatedReceiptName = getValues(`edit_receipt_name`);
        const updatedReceiptValue = getValues(`edit_receipt_value`);
 
        axios.put(`http://localhost:8080/reimbursement/receipts/${name}`, {
            name: updatedReceiptName,
            value: updatedReceiptValue,
        }).then(function (response) {
            console.log(response);
            setReceiptsResponse(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    
       
        setEditingReceiptIndex(-1);
    };

    
    
    return shouldRender ? (
        
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
                <select className="Admin_Selector">
                    <option value="">Select</option>
                    {receiptsResponse.receipts && receiptsResponse.receipts.map((receipt, index) => (
                        <option className="Option_Selector" key={index} value={receipt.name}>
                            {receipt.name}
                        </option>
                    ))}
                </select>
                </div>
    
                <div className="Admin_receips_list_wrapper">
                    {receiptsResponse.receipts && receiptsResponse.receipts.map((receipt, index) => (
                        <div className="Admin_receips_list" key={index}>
                        {editingReceiptIndex === index ? (
                            <div className="edit_receipt">
                                <div className="receipt_name">Name:</div>
                                <input
                                    {...register(`edit_receipt_name`)}
                                    className="Admin__Input_receips_list"
                                    type="text"
                                    defaultValue={receipt.name}
                                    
                                />
                                <div>MaxValue</div>
                                <input
                                    {...register(`edit_receipt_value`)}
                                    className="Admin__Input_receips_list"
                                    type="number"
                                    defaultValue={receipt.value}
                                   
                                />
                                <div className="Admin_receips_list_buttons">
                                    <button className="Admin_Form-Edit" onClick={() => handleSaveEditedReceipt(receipt.name)}>Save</button>
                                    <button className="Admin_Form-Edit" onClick={() => setEditingReceiptIndex(-1)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="Admin_Receipt_wrapper">
                                <div className="receipt_name">{index+1}.Name: {receipt.name}</div>
                                <div>MaxValue: {receipt.value}</div>
                                <div>
                                    <button
                                        className="Button_Remove"
                                        type="button"
                                        onClick={() => handleDeleteReceiptBackend(receipt.name)}
                                        >
                                        Delete
                                    </button>
                                    <button
                                        className="Admin_Form-Edit"
                                        type="button"
                                        onClick={() => handleEditReceipt(index)}
                                        >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                </div>

                

                <div className="Admin_New_Receipts">
                    {fields.map((receipt, index) => (
                        <div key={receipt.id}> 
                            <input type="text" {...register(`new_receipt_name.${index}`)} className="input_receipt" placeholder="Receipt name" />
                            <input type="number" {...register(`new_receipt_value.${index}`)} className="input_receipt" placeholder="Receipt value" />

                            <button 
                                className='Admin_Add_New_Receipts'
                                type="button" 
                                onClick={handleSaveNewReceipt}
                                >Add New
                            </button>
                            <button 
                                className='Button_Remove'
                                type="button" 
                                onClick={() => remove(index)}
                                >Remove
                            </button>
                        </div>
                        
                    ))}
                </div>
                <div></div>
                <button type="button" className="Admin_New_Receipt" onClick={() => append({ name: '', prize: ''})}>New receipt</button>
                
            </div>
                <div className="Admin_Form_LIST">
                <h3>LIMITS</h3>
                {limitsResponse && (
                    <>
                        <div>Max Total Reimbursement: {limitsResponse.totalReimbursement}$</div>
                        <div className="Limits_Container">
                            <input {...register('input_Total_Reimbursement')} type="number" className="input_Total_Reimbursement" placeholder="$"></input>
                            <button className="Admin_Form-Edit" type="button" onClick={() => handleSaveLimit('totalReimbursement', getValues('input_Total_Reimbursement'))}>Save</button>
                        </div>
                        <div>Max Distance: {limitsResponse.distance}km</div>
                        <div className="Limits_Container">
                            <input {...register('input_Distance')} type="number" className="input_Distance" placeholder="km"></input>
                            <button className="Admin_Form-Edit" type="button" onClick={() => handleSaveLimit('distance', getValues('input_Distance'))}>Save</button>
                        </div>
                        <div>Max Days: {limitsResponse.days}</div>
                        <div className="Limits_Container">
                            <input {...register('input_Days')} type="number" className="input_Days" placeholder="days"></input>
                            <button className="Admin_Form-Edit" type="button" onClick={() => handleSaveLimit('days', getValues('input_Days'))}>Save</button>
                        </div>
                    </>
                )}
            </div>
        <button className="Admin_Form-submit" type="submit" onClick={handleSaveChanges}>Save Changes to all</button>
        </form>
    )  : null;
}
