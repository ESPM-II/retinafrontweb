export const getServiceRequestCodeDisplayName = (value) => {
    if (!value) return "";
    return SERVICE_REQUEST_CODE.find((code) => code.value === value)?.label || "";
};


const SERVICE_REQUEST_CODE = [
    { value: "758598006", label: "derivación a nefrólogo pediátrico" },
    { value: "715159005", label: "derivación a servicio de atención de diabetes" },
    { value: "710910007", label: "derivación a servicio legal" },
    { value: "703155005", label: "derivación a servicio de maternidad" },
    { value: "700125004", label: "derivación a servicio de ginecología pediátrica" },
    { value: "429365000", label: "derivación a gastroenterólogo pediátrico" },
    { value: "417311009", label: "derivación a servicio de cardiología pediátrica" },
    { value: "415277000", label: "derivación a endocrinólogo pediátrico" },
    { value: "308462001", label: "derivación a servicio de anatomía patológica" },
    { value: "308461008", label: "derivación a servicio de radiología" },
    { value: "306934005", label: "derivación a servicio de cirugía vascular" },
    { value: "306201000", label: "derivación al servicio de urología" },
    { value: "306198005", label: "derivación al servicio de cirugía plástica" },
    { value: "306194007", label: "derivación al servicio de cirugía colorrectal" },
    { value: "306191004", label: "derivación al servicio de cirugía gastrointestinal" },
    { value: "306185001", label: "derivación al servicio de cirugía cardíaca" },
    { value: "306184002", label: "derivación al servicio de cirugía torácica" },
    { value: "306177005", label: "derivación a servicio de ortopedia" },
    { value: "306169006", label: "derivación a servicio de medicina física" },
    { value: "306163007", label: "derivación al servicio de nutrición" },
    { value: "306151002", label: "derivación al servicio de salud pública" },
    { value: "306148009", label: "derivación al servicio de hematología" },
    { value: "306141003", label: "derivación al servicio de radioterapia" },
    { value: "306140002", label: "derivación al servicio de oncología clínica" },
    { value: "306134009", label: "derivación al servicio de psiquiatría de niños y adolescentes" },
    { value: "306133003", label: "derivación al servicio de obstetricia y ginecología" },
    { value: "306132008", label: "derivación al servicio de neonatología" },
    { value: "306131001", label: "derivación al servicio de oncología pediátrica" },
    { value: "306130000", label: "derivación al servicio de neurología pediátrica" },
    { value: "306128002", label: "derivación al servicio de pediatría" },
    { value: "306127007", label: "derivación al servicio de reumatología" },
    { value: "306126003", label: "derivación al servicio de medicina nuclear" },
    { value: "306125004", label: "derivación al servicio de nefrología" },
    { value: "306124000", label: "derivación al servicio de infectología" },
    { value: "306119003", label: "derivación al servicio de genética" },
    { value: "306118006", label: "derivación al servicio de endocrinología" },
    { value: "306114008", label: "derivación al servicio de medicina respiratoria" },
    { value: "306105003", label: "derivación al servicio de anestesiología" },
    { value: "183549000", label: "derivación al servicio de ginecología" },
    { value: "183548008", label: "derivación al servicio de obstetricia" },
    { value: "183547003", label: "derivación al servicio de cirugía pediátrica" },
    { value: "183546007", label: "derivación al servicio de neurocirugía" },
    { value: "183544005", label: "derivación al servicio de otorrinolaringología" },
    { value: "183543004", label: "derivación al servicio de oftalmología" },
    { value: "183542009", label: "derivación al servicio de cirugía general" },
    { value: "183524004", label: "derivación al servicio de psiquiatría" },
    { value: "183523005", label: "derivación al servicio de gastroenterología" },
    { value: "183522000", label: "derivación al servicio de geriatría" },
    { value: "183521007", label: "derivación al servicio de neurología" },
    { value: "183519002", label: "derivación al servicio de cardiología" },
    { value: "183518005", label: "derivación a servicio de dermatología" },
];

export default SERVICE_REQUEST_CODE;
