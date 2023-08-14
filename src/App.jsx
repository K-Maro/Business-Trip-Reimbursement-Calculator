import './App.css'
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useState } from 'react';

function App() {

  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm();

  const {fields, append, remove} = useFieldArray({control, name: 'expense'})

  const onSubmit = data => console.log(data);

  const validateDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
    return true;
  };

  const [totalReimbursement, setTotalReimbursement] = useState(0);

  const calculateTotalReimbursement = () => {
    let total = 0;
  
    fields.forEach((expense, index) => {
      const expensesAmount = parseFloat(getValues(`expenses[${index}].amount`));
      if (!isNaN(expensesAmount)) {
        total += expensesAmount;
      }
    });
  
    const dailyAllowanceAmount = parseFloat(getValues('dailyAllowance.range'));
    if (!isNaN(dailyAllowanceAmount)) {
      total += dailyAllowanceAmount * 15;
    }
  
    const carMileageDistance = parseFloat(getValues('carMileage.distance'));
    if (!isNaN(carMileageDistance)) {
      total += carMileageDistance * 0.3;
    }
  
    setTotalReimbursement(total);
  };

  return (
    <>
    <form className='formTrip' onSubmit={handleSubmit(onSubmit)}>

      <div className='TripDate'>
        <label className='Label_TripStart'>Trip Start Date</label>
        <input type="date" {...register('tripStartDate', { required: true })} />
        {errors.tripStartDate?.type === 'required' && <span className='Error'>Start date is required</span>}

        <label className='Label_TripEnd'>Trip End Date</label>
        <input
          type="date"
          {...register('tripEndDate', {
            required: true,
            validate: (value) => validateDateRange(getValues('tripStartDate'), value)
          })}
        />
        {errors.tripEndDate?.type === 'required' && <span className='Error'>End date is required</span>}
        {errors.tripEndDate?.type === 'validate' && <span className='Error'>End date must be after start date</span>}
      </div>

      <div className='TripExpenses'>
        <h2 className='TripExpenses_Header'>Expenses</h2>
        {fields.map((expense, index) => (
          <div key={expense.id}>
            <label className='Expense_Label'>Expense Type</label>
            <select className='Expenses_Selector' {...register('expenses[0].type', { required: true })}>
              <option value="">Select an option</option>
              <option value="taxi">Taxi</option>
              <option value="hotel">Hotel</option>
              <option value="plane">Plane Ticket</option>
              <option value="train">Train</option>
            </select>
            <label className='Label_Amount'>Amount</label>
            <input className='Input_Amount'   type="number" placeholder='Amount' {...register('expenses[0].amount', { required: true })} />
            <label className='Label_Description'>Description</label>
            <input  className='Input_Description' placeholder='Description' type="text" {...register('expenses[0].description')} />
            <button 
              className='Button_Remove'
              type="button" 
              onClick={() => remove(index)}
              >Remove</button>
          </div>
        ))}

        <button 
          type="button" 
          className='Button_NewExpense'
          onClick={() => append({ type: '', amount: '', description: '' })} 
          >New Expense 
        </button>
      </div>

      <div className='DailyAllowance'>
        <h3>Daily Allowance</h3>
        <label>Number of Days</label>
        <div className='DailyAllowance_Wrapper'>
          <input  
            type="number" 
            className='Input_DailyAllowance' 
            placeholder='Number of Days'
            {...register('dailyAllowance.range', {required: true})} />
          <input 
            className="DailyAllowance_box" 
            type="checkbox" 
            {...register('dailyAllowance.disableOnSpecificDays')} />
        </div>
      </div>

      <div className='CarMileage'>
        <h3>Car Mileage Reimbursement</h3>
        <label>Distance Driven</label>
        {/* <div className='CarMileage_Wrapper'>
          <div className='RadioGroup'>
            <input type='radio' name='distanceUnit' value='km' id='km' />
            <label htmlFor='km'>km</label>
          </div>
          <div className='RadioGroup'>
            <input type='radio' name='distanceUnit' value='miles' id='miles' />
            <label htmlFor='miles'>miles</label>
          </div>
        </div> */}
        <div className='CarMileage_InputGroup'>
          <input  onChange={calculateTotalReimbursement} type="number" className='Input_CarMillage' placeholder='Car Milage' {...register('carMileage.distance', {required: true})} />
          <div className='suffix'>km</div>
        </div>
      </div>
      <h3>Total reimbursement: {totalReimbursement}</h3>
      <div className='TotalReimbursement'>
        <input type="hidden" {...register('totalReimbursement')} />
      </div>
      <button
        className='Button_Count'
        type="button"
        onClick={calculateTotalReimbursement}
      >
        Count reimbursement
      </button>
      <button type="submit">Submit Claim</button>
    </form>
    </>
  )
}

export default App
