"use client";

import { useEffect, useState } from "react";
import { CreateUserModal } from "../modals/create-user-modal";
import { EditUserModal } from "../modals/edit-user-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateUserModal />
      <EditUserModal />
    </>
  );
};
