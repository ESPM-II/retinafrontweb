export const getEncounterDisplayName = (value) => {
    if (!value || Number(value)) return "";
    return ENCOUNTER_STATUS.find((encounter) => encounter.value === value)?.label || "";
};
  
  
  const ENCOUNTER_STATUS = [
    { value: "planned", label: "Planned" },
    { value: "arrived", label: "Arrived" },
    { value: "triaged", label: "Triaged" },
    { value: "in-progress", label: "In Progress" },
    { value: "onleave", label: "On Leave" },
    { value: "finished", label: "Finished" },
    { value: "cancelled", label: "Cancelled" },
];

export default ENCOUNTER_STATUS;