export const isValidDateRange = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) {
        alert("Start and end dates are required.");
        return false;
    }

    // Parse the string inputs into Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Check if the dates are on the same day
    if (startDate.toLocaleDateString() !== endDate.toLocaleDateString()) {
        alert("Appointment must end on the same day.");
        return false;
    }
    
    // Check if start date is before the end date
    if (startDate >= endDate) {
        alert("Start date must be before the end date.");
        return false;
    }

    // Check if the dates are in the past
    const currentDate = new Date();
    if (startDate <= currentDate || endDate <= currentDate) {
        alert("Start/end date must not be in the past.");
        return false;
    }

    // Check if both dates are within 9 AM - 5 PM and not on Sunday
    const startDay = startDate.getDay();
    const startHour = startDate.getHours();
    const endDay = endDate.getDay();
    const endHour = endDate.getHours();
    const endMinutes = endDate.getMinutes();

    if (
        // Sunday
        startDay === 0 || endDay === 0 ||
        // Before 9AM or 5PM onwards
        startHour < 9 || startHour >= 17 ||
        // Before 9AM or 5PM onwards or 5PM but not at 5:00
        endHour < 9 || endHour > 17 || (endHour === 17 && endMinutes > 0)
    ) {
        alert(
            "Please select a time between Monday and Saturday, from 9 AM to 5 PM."
        );
        return false;
    }

    // All checks passed
    return true;
};

export const currentLocalTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};