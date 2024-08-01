export const getBsDisplayName = (value) => {
  if (!value) return "";
  return BIOLOGICALSEX.filter((bs) => bs.value === value)[0].label || "";
};

const BIOLOGICALSEX = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

export default BIOLOGICALSEX;
