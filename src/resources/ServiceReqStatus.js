export const getServiceRequestDisplayName = (value) => {
    if (!value || Number(value)) return "";
    return SERVICE_REQUEST_STATUS.find((request) => request.value === value)?.label || "";
};


const SERVICE_REQUEST_STATUS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "on-hold", label: "On Hold" },
    { value: "revoked", label: "Revoked" },
    { value: "completed", label: "Completed" },
    { value: "entered-in-error", label: "Entered in Error" },
    { value: "unknown", label: "Unknown" },
];

export default SERVICE_REQUEST_STATUS;