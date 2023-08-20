import './App.css'
import { useForm} from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Form() {

  const { register, setValue ,handleSubmit, control, formState: { errors }, getValues } = useForm();
  
  const [receiptsResponse, setReceiptsResponse] = useState({});
  const [fields, setFields] = useState([])
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateTime, setDateTime] = useState();
  const [responseCalculation, setResponseCalculation] = useState();

  const onSubmit = (data) => {
    console.log('Form data:', data);
    axios.post('http://localhost:8080/reimbursement/calculate', {
      carMillage: parseInt(data.carMillage),
      startDay: data.startDate,
      endDay: data.endDate,
      receipts: data.receipts.map(value => ({name: value.name, value: parseFloat(value.value)}) )
     })
      .then(function (response) {
        setResponseCalculation(response.data)
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
    });
  };




  //   axios.post('http://localhost:8080/reimbursement/calculate',  formDataToSend)
  //           .then(function (response) {
  //               console.log(response.data);
  //           })
  //           .catch(function (error) {
  //               console.log(error);
  //       });
  // };


  const validateDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
    return true;
  };



  useEffect(() => {
    axios.get('http://localhost:8080/reimbursement/receipts')
      .then((receiptsResponse) => {
        setReceiptsResponse(receiptsResponse.data);
        console.log(receiptsResponse.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }, []);

  const addNewExpense = () => {
    setFields(prevFields => [
      ...prevFields,
      { id: Date.now(), type: '', amount: '' }
    ]);
  };

  const removeExpense = (index) => {
    setFields(prevFields => prevFields.filter((_, i) => i !== index));
  };

  // const handleCalculate = (index) => {
  //       const newData = {
  //           type: getValues(`expenses[${index}].type`),
  //           amount: getValues(`expenses[${index}].amount`),
  //           days: getValues(`dailyAllowance.range`),
  //           carMileage: parseFloat(getValues(`carMileage.distance`))
  
  //       };
  //       axios.post('http://localhost:8080/reimbursement/calculate', newData)
  //           .then(function (response) {
  //               console.log(response.data);
  //           })
  //           .catch(function (error) {
  //               console.log(error);
  //       });
  // };


  useEffect(() => {
    const startDate = new Date(getValues('startDate'));
    const endDate = new Date(getValues('endDate'));
    const days = [];
  
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
  
    setSelectedDates(days);
  }, [getValues('startDate'), getValues('endDate')]);

  

  return(
    <>
    <form className='formTrip' onSubmit={handleSubmit(onSubmit)}>

      <div className='TripDate'>
        <label className='Label_TripStart'>Trip Start Date</label>
        <input type="date" {...register('startDate', { required: true })} onChange={e => setDateTime(e.target.value)} />
        {errors.startDate?.type === 'required' && <span className='Error'>Start date is required</span>}

        <label className='Label_TripEnd'>Trip End Date</label>
        <input
          type="date"
          {...register('endDate', {
            required: true,
            validate: (value) => validateDateRange(getValues('startDate'), value)
          })}
        />
        {errors.endDate?.type === 'required' && <span className='Error'>End date is required</span>}
        {errors.endDate?.type === 'validate' && <span className='Error'>End date must be after start date</span>}
      </div>

      <div className='TripExpenses'>
          <h2 className='TripExpenses_Header'>Expenses</h2>
          {fields.map((expense, index) => (
            <div key={expense.id}>
              <label className='Expense_Label'>Expense Type</label>
              <select className='Expenses_Selector' {...register(`receipts[${index}].name`, { required: true })}>
                <option value="">Select</option>
                {receiptsResponse.receipts && receiptsResponse.receipts.map((receipt, receiptIndex) => (
                  <option className="Option_Selector" key={receiptIndex} value={receipt.name}>
                    {receipt.name}
                  </option>
                ))}
              </select>
              <label className='Label_Amount'>Amount</label>
              <input className='Input_Amount' type="number" placeholder='$' {...register(`receipts[${index}].value`, { required: true })} />
              <button
                className='Button_Remove'
                type="button"
                onClick={() => removeExpense(index)}
              >Remove</button>
            </div>
          ))}

          <button
            type="button"
            className='Button_NewExpense'
            onClick={addNewExpense}
          >New Expense
          </button>
        </div>

     
      <div className='TripDaysGrid'>
        
      <h2>Days of Trip</h2>
      <button className='button_generate'> Generate LIST</button>
      <div className='DaysGrid'>
        {selectedDates.map((date, index) => (
          <div key={index} className='DayCell'>
            <span>{date.toLocaleDateString()}</span>
            <input
              type='checkbox'
            />
          </div>
        ))}
      </div>


    </div>

    <div className='CarMileage'>
      <h3>Car Mileage Reimbursement</h3>
      <label>Distance Driven</label>
      <div className='CarMileage_InputGroup'>
        <input
          type="number"
          className='Input_CarMillage'
          placeholder='Car Mileage'
          {...register('carMillage', { required: true })}
          onChange={(e) => {
            const carMileageValue = parseFloat(e.target.value);
            setValue('carMillage', carMileageValue);
          }}
        />
        <div className='suffix'>km</div>
      </div>
    </div>


      <h3>Total reimbursement: {responseCalculation} </h3>
      <div className='TotalReimbursement'>
        {/* <input type="hidden" {...register('totalReimbursement')} /> */}
      </div>
      
      <button
        className='Button_Count'
        type="button"
      >
        Count reimbursement
      </button>
      <button className='btn-submit' type="submit">Submit Claim</button>
    </form>
    </>
  );
}

export default Form
