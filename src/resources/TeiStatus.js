
const INTERCONSULTATION_STATUS = {
    esperaReferencia: { 
        code: "1", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "A la espera de referencia" 
    },
    esperaRevision: { 
        code: "2", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "A la espera de revisión" 
    },
    esperaPriorizacion: { 
        code: "3", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "A la espera de priorización" 
    },
    esperaAgendamiento: { 
        code: "4", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "A la espera de agendamiento" 
    },
    esperaAtencion: { 
        code: "5", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "En espera de la atención" 
    },
    esperaCierre: { 
        code: "6", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "A la espera de cierre" 
    },
    cerrada: { 
        code: "7", 
        system: "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta", 
        display: "Cerrada" 
    }
};

export default INTERCONSULTATION_STATUS;
