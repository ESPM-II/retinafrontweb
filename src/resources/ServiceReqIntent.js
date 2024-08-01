export const getServiceRequestIntentDisplayName = (value) => {
    if (!value || Number(value)) return "";
    return SERVICE_REQUEST_INTENT.find((intent) => intent.value === value)?.label || "";
};


const SERVICE_REQUEST_INTENT = [
    { value: "proposal", label: "Proposal" },
    { value: "plan", label: "Plan" },
    { value: "directive", label: "Directive" },
    { value: "order", label: "Order" },
    { value: "original-order", label: "Original Order" },
    { value: "reflex-order", label: "Reflex Order" },
    { value: "filler-order", label: "Filler Order" },
    { value: "instance-order", label: "Instance Order" },
    { value: "option", label: "Option" },
];

export default SERVICE_REQUEST_INTENT;
