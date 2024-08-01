
export const getMtDisplayName = (value) => {
  if (!value || Number(value)) return "";
  return MARITALSTATUS.filter((mt) => mt.value === value)[0].label || "";
}


const MARITALSTATUS = [
  {
    value: "A",
    label: "Annulled",
  },
  {
    value: "D",
    label: "Divorced",
  },
  {
    value: "I",
    label: "Interlocutory",
  },
  { value: "L", label: "Legally Separated" },
  {
    value: "M",
    label: "Married",
  },
  { value: "P", label: "Polygamous" },
  {
    value: "S",
    label: "Never Married",
  },
  {
    value: "T",
    label: "Domestic partner",
  },
  {
    value: "U",
    label: "Unmarried",
  },
  { value: "W", label: "Widowed", definition: "The spouse has died" },
  {
    value: "UNK",
    label: "Unknown",
},
];

export default MARITALSTATUS;
