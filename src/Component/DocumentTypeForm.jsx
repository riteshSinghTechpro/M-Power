import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  TableCell,
} from "@mui/material";
import { DialogTitle } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import axios from "axios";

function DocumentTypeForm(props) {
  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
      box-sizing: border-box;
      font-size: 0.875rem; 
      font-weight: 400;
      width: 100%;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: 4px;
    `
  );

  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const empCode = sessionStorage.getItem("empCode");

  const [isVisible, setIsVisible] = useState(true);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    if (props.docId) {
      setIsEdit(true);
      fetchDocumentTypeDetails(props.docId);
    }
  }, [props.docId]);

  const fetchDocumentTypeDetails = async (docId) => {
    try {
      const response = await axios.get(
        `${baseURL}/DocType/GetDocTypeById?DocTypeId=${docId}`
      );
      const data = response.data;
      setDocumentType(data.docTypeText);
      setDescription(data.docTypeDescription);
    } catch (error) {
      console.error("Error fetching document type details:", error);
    }
  };

  const handleNameChange = (e) => {
    setDocumentType(e.target.value);
    if (e.target.value) {
      setNameError("");
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (e.target.value) {
      setDescriptionError("");
    }
  };

  const validate = () => {
    let isValid = true;

    if (!documentType.trim()) {
      setNameError("Please enter Document Type");
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Please enter Description");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const normalizedDocumentType = documentType
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

      const exists = props.filteredRows.some(
        (row) =>
          row.docTypeText.trim().toLowerCase() === normalizedDocumentType &&
          row.docTypeId !== (isEdit ? props.docId : null)
      );

      if (exists) {
        toast.error("A Document Type with the same name already exists.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          docTypeId: isEdit ? props.docId : 0,
          docTypeText: documentType,
          docTypeDescription: description,
          status: true,
          createdBy: empCode,
          modifiedBy: empCode,
        };

        let url = `${baseURL}/DocType/CreateDocType`;
        if (isEdit) {
          url = `${baseURL}/DocType/UpdateDocType`;
        }

        const res = await axios.post(url, payload);

        if (res.data !== 0) {
          if (isEdit) {
            toast.success("Document Type Updated Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
            props.refreshData();
            props.showDivData(!hide);
            resetForm();
            setHide(false);
          } else {
            toast.success("Document Type Saved Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
            props.refreshData();
            props.showDivData(!hide);
            resetForm();
          }
        } /* else {
          toast.error("A Document Type with the same name already exists.", {
            position: "top-center",
            closeButton: false,
            autoClose: 2000,
          });
        } */
      } catch (err) {
        toast.error("An error occurred while saving the document type.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setDocumentType("");
    setDescription("");
    setNameError("");
    setDescriptionError("");
    setError("");
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setHide(false);
    props.showDivData(!hide);
  };
  // const handleCancel = () => {
  //   setIsVisible(false);
  // };

  return (
    <div>
      {hide && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <form onSubmit={handleSubmit} className="tondform-css">
            <Grid container>
              <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 3, pr: 1 }}>
                {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Document Type</DialogTitle> */}
                <TextField
                  fullWidth
                  id="documentType"
                  label="Document Type"
                  variant="outlined"
                  value={documentType}
                  onChange={handleNameChange}
                />
                {nameError && (
                  <Typography color="error">{nameError}</Typography>
                )}
              </Grid>
              <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 1, pr: 2 }}>
                {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Description</DialogTitle> */}
                <TextField
                  fullWidth
                  minRows={1}
                  id="description"
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                {descriptionError && (
                  <Typography className="errorcss">
                    {descriptionError}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ mt: 2, mb: 2, pl: 2, pr: 3 }}
                textAlign={"right"}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="primary mr-10"
                  disabled={isLoading}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  type="button"
                  className="warning"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}
    </div>
  );
}

export default DocumentTypeForm;