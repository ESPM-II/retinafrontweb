import { v4 } from "uuid";
import EventType from "./TeiEventType";
import PRACTITIONER_ROLE_TYPE from "./PractitionerRoleType";
import INTERCONSULTATION_STATUS from "./TeiStatus";
import ENCOUNTER_STATUS from "./EncounterStatus";
import ENCOUNTER_MODALITIES from "./EncounterModalities";
import dayjs from "dayjs";
import SERVICE_REQUEST_STATUS from "./ServiceReqStatus";
import SERVICE_REQUEST_INTENT from "./ServiceReqIntent";

export const teiBundleIniciar = ({
  teiEventType = EventType.iniciar.code,
  practitionerRoleTypeCode = PRACTITIONER_ROLE_TYPE.iniciador.code,
  practitionerRoleTypeDisplay = PRACTITIONER_ROLE_TYPE.iniciador.display,
  interconsultantStateCode = INTERCONSULTATION_STATUS.esperaReferencia.code,
  interconsultantStateDisplay = INTERCONSULTATION_STATUS.esperaReferencia.display,
  practitionerId,
  patientId,
  organizationId,
  status = SERVICE_REQUEST_STATUS[0].value,
  intent = SERVICE_REQUEST_INTENT[0].value,
  priority,
  encounterStatus = ENCOUNTER_STATUS[5].value,
  encounterModalityId = ENCOUNTER_MODALITIES[0].value,
}) => {
  const practitionerRoleUid = v4();
  const serviceRequestUid = v4();
  const encounterUid = v4();
  const conditionUid = v4();
  const messageHeaderUid = v4();

  console.log("INTENT", intent);
  
  const bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: `urn:uuid:${messageHeaderUid}`,
        request: {
          method: "POST",
          url: "MessageHeader",
        },
        resource: {
          resourceType: "MessageHeader",
          meta: {
            lastUpdated: "2023-01-20T14:12:10Z",
            profile: [
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/MessageHeaderLE",
            ],
          },
          eventCoding: {
            system:
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSTipoEventoLE",
            code: teiEventType,
          },
          author: {
            reference: `urn:uuid:${practitionerRoleUid}`,
          },
          source: {
            software: "Software San Juan Dios (SSJD)",
            endpoint: "http://link-to-sending.cl",
          },
          focus: [
            {
              reference: `urn:uuid:${serviceRequestUid}`,
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:${serviceRequestUid}`,
        request: {
          method: "POST",
          url: "ServiceRequest",
        },
        resource: {
          resourceType: "ServiceRequest",
          meta: {
            profile: [
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ServiceRequestLE",
            ],
          },
          extension: [
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtStringFundamentoPriorizacion",
              valueString:
                "Se requiere pronta confirmación para iniciar tratamiento.",
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/SospechaPatologiaGes",
              valueBoolean: false,
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtBoolResolutividadAPS",
              valueBoolean: false,
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/ExtBoolAlergia",
              valueBoolean: false,
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/OrigenInterconsulta",
              valueCodeableConcept: {
                coding: [
                  {
                    system:
                      "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSinterconsulta",
                    code: "1",
                    display: "APS",
                  },
                ],
              },
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/EstadoInterconsultaCodigoLE",
              valueCodeableConcept: {
                coding: [
                  {
                    system:
                      "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoInterconsulta",
                    code: interconsultantStateCode,
                    display: interconsultantStateDisplay,
                  },
                ],
              },
            },
          ],
          status: status,
          intent: intent,
          priority: priority,
          subject: {
            reference: `Patient/${patientId}`,
          },
          encounter: {
            reference: `urn:uuid:${encounterUid}`,
          },
          authoredOn: dayjs().format("YYYY-MM-DD"),
          reasonCode: [
            {
              coding: [
                {
                  system:
                    "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSDerivadoParaCodigo",
                  code: "1",
                },
              ],
            },
          ],
          supportingInfo: [
            {
              reference: `urn:uuid:${conditionUid}`,
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:${encounterUid}`,
        request: {
          method: "POST",
          url: "Encounter",
        },
        resource: {
          resourceType: "Encounter",
          meta: {
            profile: [
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/EncounterInicioLE",
            ],
          },
          identifier: [
            {
              type: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                    code: "FILL",
                  },
                ],
              },
              value: "1",
            },
          ],
          status: encounterStatus,
          class: {
            system:
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSModalidadAtencionCodigo",
            code: encounterModalityId,
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          period: {
            start: dayjs().format('YYYY-MM-DD'),
            end: dayjs().format('YYYY-MM-DD')
          },
        },
      },
      /* {
        fullUrl: `Patient/${patientId}`,
        request: {
          method: "PUT",
          url: "Patient",
        },
        resource: {
          resourceType: "Patient",
          meta: {
            profile: [
              "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PacienteMinsalMPI",
            ],
          },
          extension: [
            {
              url: "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/CodigoPaises",
              valueCodeableConcept: {
                coding: [
                  {
                    system:
                      "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",
                    code: "152",
                  },
                ],
              },
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PaisOrigenMPI",
              valueCodeableConcept: {
                coding: [
                  {
                    system:
                      "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",
                    code: "158",
                  },
                ],
              },
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/SexoBiologico",
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://hl7.org/fhir/administrative-gender",
                    code: "male",
                  },
                ],
              },
            },
            {
              url: "http://hl7.org/fhir/StructureDefinitionPatient-birthPlace",
              valueAddress: {
                text: "Linares",
              },
            },
            {
              url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PueblosOriginariosPerteneciente",
              valueBoolean: true,
            },
          ],
          identifier: [
            {
              type: {
                extension: [
                  {
                    url: "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/CodigoPaises",
                    valueCodeableConcept: {
                      coding: [
                        {
                          system:
                            "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",
                          code: "032",
                        },
                      ],
                    },
                  },
                ],
                coding: [
                  {
                    system:
                      "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador",
                    code: "04",
                  },
                ],
              },
              system: "http://www.acme.com/identifiersPatient",
              value: "9848328",
            },
          ],
          name: [
            {
              use: "official",
              family: "Díaz",
              _family: {
                extension: [
                  {
                    url: "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/SegundoApellido",
                    valueString: "Cortéz",
                  },
                ],
              },
              given: ["Anibal"],
            },
          ],
          telecom: [
            {
              system: "phone",
              value: "56999888777",
              use: "mobile",
              rank: 1,
            },
          ],
          gender: "male",
          birthDate: "1955-10-20",
          deceasedBoolean: false,
          address: [
            {
              use: "home",
              line: ["Linares"],
            },
          ],
        },
      }, */
      {
        fullUrl: `urn:uuid:${conditionUid}`,
        request: {
          method: "POST",
          url: "Condition",
        },
        resource: {
          "resourceType" : "Condition",
          "clinicalStatus" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/condition-clinical",
                "code" : "active",
                "display": "Active"
              }
            ]
          },
          "verificationStatus" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                "code" : "confirmed",
                "display": "Confirmed"
              }
            ]
          },
          "category" : [
            {
              "coding" : [
                {
                  "system" : "http://terminology.hl7.org/CodeSystem/condition-category",
                  "code" : "encounter-diagnosis",
                  "display": "Encounter Diagnosis"
                }
              ],
              "text" : "diagnostico"
            }
          ],
          "severity" : {
            "coding" : [
              {
                "system" : "http://snomed.info/sct",
                "code" : "6736007"
              }
            ]
          },
          "code" : {
            "coding" : [
              {
                "code" : "BD1Z",
                "display" : "Insuficiencia cardíaca, sin especificación"
              }
            ],
            "text" : "insuficiencia cardiaca"
          },
          "subject" : {
            "reference" : `Patient/${patientId}`
          }
        },
      },
      /* {
        "fullUrl": `/Practitioner/${practitionerId}`,
        "request": {
          "method": "PUT",
          "url": "Practitioner"
        },
        "resource": {
          "resourceType": "Practitioner",
          "meta" : {
                "profile" : [
                "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PractitionerLE"
                ]
            },
            "identifier" : [
                {
                "use" : "official",
                "type" : {
                    "coding" : [
                    {
                        "system" : "http://registrocivil/RUN",
                        "code" : "RUN"
                    }
                    ]
                },
                "system" : "http://registrocivil/RUN",
                "value" : "10.111.111",
                "extension" : [
                    {
                    "url" : "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/DigitoVerificador",
                    "valueString" : "k"
                    }
                ]
                },
                {
                "use" : "secondary",
                "system" : "http://rnpi.superdesalud.gob.cl",
                "value" : "992323"
                }
            ],
            "name" : [
                {
                "use" : "official",
                "family" : "Sepúlveda",
                "_family" : {
                    "extension" : [
                    {
                        "url" : "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/SegundoApellido",
                        "valueString" : "Manriquez"
                    }
                    ]
                },
                "given" : [
                    "Ernesto"
                ]
                }
            ],
            "qualification" : [ 
                {
                "identifier" : [
                    {
                    "value" : "tit"
                    }
                ],
                "code" : {
                    "coding" : [
                    {
                        "system" : "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSTituloProfesional",
                        "code" : "1"
                    }
                    ]
                }
                },
                {
                "identifier" : [
                    {
                    "value" : "Esp"
                    }
                ],
                "code" : {
                    "coding" : [
                    {
                        "system" : "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEspecialidadMed",
                        "code" : "28"
                    }
                    ]
                }
                }
            ]
        }
      }, */
      {
        fullUrl: `urn:uuid:${practitionerRoleUid}`,
        request: {
          method: "POST",
          url: "PractitionerRole",
        },
        resource: {
          resourceType: "PractitionerRole",
          practitioner: {
            reference: `Practitioner/${practitionerId}`,
          },
          organization: {
            reference: `Organization/${organizationId}`,
          },
          code: [
            {
              coding: [
                {
                  system:
                    "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSPractitionerTipoRolLE",
                  code: practitionerRoleTypeCode,
                  display: practitionerRoleTypeDisplay,
                },
              ],
            },
          ],
        },
      },
      {
        fullUrl: `Organization/${organizationId}`,
        request: {
          method: "PUT",
          url: "Organization",
        },
        resource: {
          resourceType: "Organization",
          id: organizationId,
          identifier: [
            {
              type: {
                coding: [
                  {
                    system: "http://minsal.cl/deis/establecimientos",
                    code: "105303",
                  },
                ],
              },
            },
          ],
          name: "Centro de Salud Familiar San Juan Dios",
        },
      },
    ],
  };
  return bundle;
};
