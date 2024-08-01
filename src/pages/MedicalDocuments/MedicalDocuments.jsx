import { useState } from "react";
import Spinner from "../../components/Loading/Spinner";
import AntTable from "../../components/Tables/AntTable";
// import { useGetDocuments } from "../../hooks/documents";
import { getFakeDocuments, makeTableColumns } from "./medical.documents.base";
import BaseModal from "../../components/Modals/BaseModal";
import DocumentsModal from "./DocumentsModal";


const MedicalDocuments = () => {
  // const { data, isFetching, error } = useGetDocuments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);;

  // const { getDocuments: list } = data ? data : [];

  // isFetching
  if (false) {
    return <Spinner tip="Loading Documents" />;
  }

  const onCancel = () => {
    setIsModalOpen(false);
  }
  
  const fakeData = getFakeDocuments();

  console.log("fakeData", fakeData);

  return (
    <div className="w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        hasAddButton={false}
        setIsModalOpen={setIsModalOpen}
        headTitle="Documentos médicos"
        title={(editingDocument ? "Edit" : "Create") + " Document"}
        text="Add Document"
        component={<></>}
        onCancel={onCancel}
      />
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable 
          data={fakeData} 
          hasPagination={true} 
          columns={makeTableColumns(
            {
              setEditingDocument: setEditingDocument,
              setIsModalOpen: setIsModalOpen,
              setIsDocumentsModalOpen: setIsDocumentsModalOpen
            })} 
        />
      </main>
      <DocumentsModal editingDocument={editingDocument} isModalOpen={isDocumentsModalOpen} setIsModalOpen={setIsDocumentsModalOpen}/>
    </div>
  );
  }
  
  
  export default MedicalDocuments;