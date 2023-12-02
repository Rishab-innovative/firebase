import React from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CustomModal: React.FC<{
  title: string;
  setOpenCloseModal: any;
  openCloseModal: boolean;
  handleSuccessSignUp: any;
}> = ({ title, setOpenCloseModal, openCloseModal, handleSuccessSignUp }) => {
  return (
    <>
      <Modal open={openCloseModal} onClose={() => setOpenCloseModal(false)}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="mb-4"
          >
            {title}
          </Typography>
          <Button
            variant="contained"
            onClick={handleSuccessSignUp}
            sx={{ marginTop: "2rem" }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
