import { useState, useCallback } from "react";

const useAppointmentForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);

    const onFormChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    return { formData, onFormChange };
};

export default useAppointmentForm;
