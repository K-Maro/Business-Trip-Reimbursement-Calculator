import React, { useState, useEffect } from 'react';
import Form from '../../src/Form';
import { getUserTypeFromToken } from '../getUserTypeFromToken';

export default function HomePage() {
    const [showForm, setShowForm] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
    };
    const userType = getUserTypeFromToken();

    useEffect(() => {
        if (userType !== 'USER' && userType !== 'ADMIN') {
        setShouldRender(false);
        window.location.href = '/Login';
        }else{
        setShouldRender(true);
        }
    }, [userType]);

    return shouldRender ? (
        <div>
            <button onClick={handleButtonClick}>Create a new reimbursement claim</button>
            {showForm && <Form />}
        </div>
    ) : null;
}