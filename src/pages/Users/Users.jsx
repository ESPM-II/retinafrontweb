import { useState } from "react";
import { Button } from "antd";
import Spinner from "../../components/Loading/Spinner";
import AntTable from "../../components/Tables/AntTable";
import { useGetUsers } from "../../hooks/users";
import { getFakeUsers, makeTableColumns } from "./users.base";
import BaseModal from "../../components/Modals/BaseModal";

const Users = () => {
  const { data, isFetching, error } = useGetUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const { getUsers: list } = data ? data : [];

  if (isFetching) {
    return <Spinner tip="Loading Users" />;
  }

  const onCancel = () => {
    setIsModalOpen(false);
  }
  
  const fakeData = getFakeUsers();

  console.log("fakeData", fakeData);

  return (
    <div className="w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Manage Users"
        title={(isEditingUser ? "Edit" : "Create") + " User"}
        text="Add User"
        component={<></>}
        onCancel={onCancel}
      />
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable 
          data={fakeData} 
          // pagination={false} 
          columns={makeTableColumns(
            {
              setIsEditingUser: setIsEditingUser,
              setIsModalOpen: setIsModalOpen
            })} 
        />
      </main>
    </div>
  );
};

export default Users;
