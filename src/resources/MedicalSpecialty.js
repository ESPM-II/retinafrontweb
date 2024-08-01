export const getMedicalSpecialtyDisplayName = (value) => {
    if (!value) return "";
    return MEDICAL_SPECIALTY.find((specialty) => specialty.value === value)?.label || "";
};



const MEDICAL_SPECIALTY = [
    { value: "1", label: "ANATOMÍA PATOLÓGICA" },
    { value: "2", label: "ANESTESIOLOGÍA" },
    { value: "3", label: "CARDIOLOGÍA" },
    { value: "4", label: "CIRUGÍA GENERAL" },
    { value: "5", label: "CIRUGÍA DE CABEZA, CUELLO Y MAXILOFACIAL" },
    { value: "6", label: "CIRUGÍA CARDIOVASCULAR" },
    { value: "7", label: "CIRUGÍA DE TÓRAX" },
    { value: "8", label: "CIRUGÍA PLÁSTICA Y REPARADORA" },
    { value: "9", label: "CIRUGÍA PEDIÁTRICA" },
    { value: "10", label: "CIRUGÍA VASCULAR PERIFÉRICA" },
    { value: "11", label: "COLOPROCTOLOGÍA" },
    { value: "12", label: "DERMATOLOGÍA" },
    { value: "13", label: "DIABETOLOGÍA" },
    { value: "14", label: "ENDOCRINOLOGÍA ADULTO" },
    { value: "15", label: "ENDOCRINOLOGÍA PEDIÁTRICA" },
    { value: "16", label: "ENFERMEDADES RESPIRATORIAS DEL ADULTO (BRONCOPULMONAR)" },
    { value: "17", label: "ENFERMEDADES RESPIRATORIAS PEDIÁTRICAS (BRONCOPULMONAR PEDIATRICO)" },
    { value: "18", label: "GASTROENTEROLOGÍA ADULTO" },
    { value: "19", label: "GASTROENTEROLOGÍA PEDIÁTRICA" },
    { value: "20", label: "GENÉTICA CLÍNICA" },
    { value: "21", label: "GERIATRÍA" },
    { value: "22", label: "GINECOLOGÍA PEDIÁTRICA Y DE LA ADOLESCENCIA" },
    { value: "23", label: "HEMATOLOGÍA" },
    { value: "24", label: "IMAGENOLOGÍA" },
    { value: "25", label: "INFECTOLOGÍA" },
    { value: "26", label: "INMUNOLOGÍA" },
    { value: "27", label: "LABORATORIO CLÍNICO" },
    { value: "28", label: "MEDICINA FAMILIAR" },
    { value: "29", label: "MEDICINA FÍSICA Y REHABILITACIÓN (FISIATRIA ADULTO)" },
    { value: "30", label: "MEDICINA INTERNA" },
    { value: "31", label: "MEDICINA INTENSIVA ADULTO" },
    { value: "32", label: "MEDICINA INTENSIVA PEDIÁTRICA" },
    { value: "33", label: "MEDICINA LEGAL" },
    { value: "34", label: "MEDICINA MATERNO INFANTIL" },
    { value: "35", label: "MEDICINA NUCLEAR" },
    { value: "36", label: "MEDICINA DE URGENCIA" },
    { value: "37", label: "NEFROLOGÍA ADULTO" },
    { value: "38", label: "NEFROLOGÍA PEDIÁTRICO" },
    { value: "39", label: "NEONATOLOGÍA" },
    { value: "40", label: "NEUROCIRUGÍA" },
    { value: "41", label: "NEUROLOGÍA ADULTO" },
    { value: "42", label: "NEUROLOGÍA PEDIÁTRICA" },
    { value: "43", label: "OBSTETRICIA Y GINECOLOGÍA" },
    { value: "44", label: "OFTALMOLOGÍA" },
    { value: "45", label: "ONCOLOGÍA MÉDICA" },
    { value: "46", label: "OTORRINOLARINGOLOGÍA" },
    { value: "47", label: "PEDIATRÍA" },
    { value: "48", label: "PSIQUIATRÍA ADULTO" },
    { value: "49", label: "PSIQUIATRÍA PEDIÁTRICA Y DE LA ADOLESCENCIA" },
    { value: "50", label: "RADIOTERAPIA ONCOLÓGICA" },
    { value: "51", label: "REUMATOLOGÍA" },
    { value: "52", label: "SALUD PÚBLICA" },
    { value: "53", label: "TRAUMATOLOGÍA Y ORTOPEDIA" },
    { value: "54", label: "UROLOGÍA" },
    { value: "55", label: "CARDIOLOGÍA PEDIÁTRICA" },
    { value: "56", label: "CIRUGÍA DIGESTIVA" },
    { value: "57", label: "CIRUGÍA PLASTICA Y REPARADORA PEDIÁTRICA" },
    { value: "58", label: "GINECOLOGÍA" },
    { value: "59", label: "HEMATO-ONCOLOGÍA PEDIÁTRICA" },
    { value: "60", label: "INFECTOLOGÍA PEDIATRICA" },
    { value: "61", label: "MEDICINA FAMILIAR DEL NIÑO" },
    { value: "62", label: "MEDICINA FISICA Y REHABILITACIÓN PEDIÁTRICA (FISIATRIA PEDIATRICA)" },
    { value: "63", label: "NUTRIÓLOGO" },
    { value: "64", label: "NUTRIÓLOGO PEDIÁTRICO" },
    { value: "65", label: "REUMATOLOGÍA PEDIÁTRICA" },
    { value: "66", label: "OBSTETRICIA" },
    { value: "67", label: "TRAUMATOLOGÍA Y ORTOPEDIA PEDIÁTRICA" },
    { value: "68", label: "UROLOGÍA PEDIÁTRICA" },
];

export default MEDICAL_SPECIALTY;
