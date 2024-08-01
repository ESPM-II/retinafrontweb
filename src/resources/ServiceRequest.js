import dayjs from "dayjs";


const serviceRequest = ({
    id,
    status,
    intent,
    priority,
    code,
}) => {
    const resource = {
        resourceType: "ServiceRequest",
        id: id,
        text: {
            status: "extensions",
            div: "<div xmlns=\"http://www.w3.org/1999/xhtml\">ServiceRquest</div>"
        },
        extension: [
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtStringFundamentoPriorizacion",
                valueString: "FundamentoPriorizacion"
            },
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/SospechaPatologiaGes",
                valueBoolean: true
            },
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtBoolResolutividadAPS",
                valueBoolean: true
            },
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtBoolAlergia",
                valueBoolean: false
            },
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/OrigenInterconsulta",
                valueCodeableConcept: {
                    coding: [
                        {
                            system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSinterconsulta",
                            code: "1",
                            display: "APS"
                        }
                    ]
                }
            },
            {
                url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/EstadoInterconsultaCodigoLE",
                valueCodeableConcept: {
                    coding: [
                        {
                            system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta",
                            code: "1",
                            display: "A la espera de referencia"
                        }
                    ]
                }
            }
        ],
        status: status,
        intent: intent,
        priority: priority,
        code: {
            coding: [
                {
                    code: code,
                }
            ]
        },
        subject: {
            reference: "http://acme.com/ehr/fhir/Patient/EjemploPatient"
        },
        encounter: {
            reference: "http://acme.com/ehr/fhir/Encounter/enc1"
        },
        authoredOn: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        reasonCode: [
            {
                coding: [
                    {
                        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSDerivadoParaCodigo",
                        code: "1",
                        display: "Confirmación"
                    }
                ]
            }
        ]
    };
    return resource;
}

export default serviceRequest;