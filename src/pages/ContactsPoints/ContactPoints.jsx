import React, { useState, Fragment } from "react";
import Spinner from "../../components/Loading/Spinner";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { Form } from "antd";
import { getFakeContacts, makeTableColumns } from "./contact.points.base";
import { GET_ALL_CONTACTS } from "../../graphql/Queries/contactPoints.graphql";
import { useQuery } from "@apollo/client";


const ContactPoints = () => {
  // const { data, isFetching, error } = useGetContacts();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const { data, error, loading} = useQuery(GET_ALL_CONTACTS);

  if(loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const contactPoints = data.getContacts.contacts;

  // const { getContacts: list } = data ? data : [];
  // isFetching
  if (false) {
    return <Spinner tip="Loading Contacts" />;
  }

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <BaseModal
        hasAddButton={false}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Puntos de contacto"
        title={(isEditingContact ? "Edit" : "Create") + " Contact"}
        text="Add Contact"
        component={<>Contact Points Detail from={form}</>}
        onCancel={onCancel}
      />
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable
          data={contactPoints}
          // hasPagination={false}
          columns={makeTableColumns({
            setIsEditingContact: setIsEditingContact,
            setIsModalOpen: setIsModalOpen,
          })}
        />
      </main>
    </div>
  );
};

export default ContactPoints;
