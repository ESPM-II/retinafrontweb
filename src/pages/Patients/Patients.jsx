import { useState } from "react";
import Spinner from "../../components/Loading/Spinner";
import AntTable from "../../components/Tables/AntTable";
// import { useGetPatients } from "../../hooks/patients";
import { getFakePatients, makeTableColumns } from "./patients.base";
import BaseModal from "../../components/Modals/BaseModal";

const Patients = () => {
  // const { data, isFetching, error } = useGetPatients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);

  // const { getPatients: list } = data ? data : [];
  // isFetching
  if (false) {
    return <Spinner tip="Loading Patients" />;
  }

  const onCancel = () => {
    setIsModalOpen(false);
  }
  
  const fakeData = getFakePatients();

  console.log("fakeData", fakeData);

  return (
    <div className="w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Manage Patients"
        title={(isEditingPatient ? "Edit" : "Create") + " Patient"}
        text="Add Patient"
        component={<></>}
        onCancel={onCancel}
      />
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable 
          data={fakeData} 
          // pagination={false} 
          columns={makeTableColumns(
            {
              setIsEditingPatient: setIsEditingPatient,
              setIsModalOpen: setIsModalOpen
            })} 
        />
      </main>
    </div>
  );
};

export default Patients;
