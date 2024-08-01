export const getServiceRequestPriorityDisplayName = (value) => {
    if (!value) return "";
    return SERVICE_REQUEST_PRIORITY.find((priority) => priority.value === value)?.label || "";
};


const SERVICE_REQUEST_PRIORITY = [
    { value: "routine", label: "Normal" },
    { value: "urgent", label: "Urgent" },
];

export default SERVICE_REQUEST_PRIORITY;

