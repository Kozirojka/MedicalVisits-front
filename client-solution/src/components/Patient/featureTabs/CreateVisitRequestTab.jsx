import { useState } from "react";
import CreateVisitModal from "../CreateVisitModal";
import { Button } from "@mui/material";

const CreateVisitRequestTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        sx={{ m: 2, fontWeight: 'bold' }}
      >
        Create visit request
      </Button>


      <CreateVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateVisitRequestTab;
