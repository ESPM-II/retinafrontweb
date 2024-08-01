const patientResource = ({
  id = null,
  gender = "male",
  countryId = "152",
  originCountryId = "152",
  birthPlace = "",
  isNative = false,
  identifierCountry = "152",
  identifierType = "04",
  identifierValue = "",
  firtsFamilyName = "",
  lastFamilyName = "",
  given = "",
  telecomType = "phone",
  telecomValue = "",
  birthDate = "",
  address = "",
  maritalStatus = "S",
}) => {
  const resource = {
    resourceType: "Patient",
    ...(id ? { id: id } : {}),
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
              system: "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",
              code: countryId,
            },
          ],
        },
      },
      {
        url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PaisOrigenMPI",
        valueCodeableConcept: {
          coding: [
            {
              system: "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",
              code: originCountryId,
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
              code: gender,
            },
          ],
        },
      },
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
        valueAddress: {
          text: birthPlace,
        },
      },
      {
        url: "https://interoperabilidad.minsal.cl/fhir/ig/tei/StructureDefinition/PueblosOriginariosPerteneciente",
        valueBoolean: isNative,
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
                    code: identifierCountry,
                  },
                ],
              },
            },
          ],
          coding: [
            {
              system:
                "https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador",
              code: identifierType,
            },
          ],
        },
        system: "http://www.acme.com/identifiers/patient",
        value: identifierValue,
      },
    ],
    name: [
      {
        use: "official",
        family: firtsFamilyName,
        _family: {
          extension: [
            {
              url: "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/SegundoApellido",
              valueString: lastFamilyName,
            },
          ],
        },
        given: [given],
      },
    ],
    telecom: [
      {
        system: telecomType,
        value: telecomValue,
      },
    ],
    birthDate: birthDate,
    address: [
      {
        use: "home",
        line: [address],
      },
    ],
    gender: gender,
    maritalStatus: {
      coding: [
        {
          system:
            "https://interoperabilidad.minsal.cl/fhir/ig/tei/CodeSystem/CSEstadoCivil",
          code: maritalStatus,
        },
      ],
    },
  };
  return resource;
};

export default patientResource;
