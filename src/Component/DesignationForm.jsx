import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  FormControl,
  Grid,
  TextField,
  Typography,
  DialogTitle,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function DesignationForm(props) {
  const baseURL = "https://staffcentral.azurewebsites.net/api";
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

  const { data } = props;
  const [designationName, setDesignationName] = useState("");
  const [designationDescription, setDesignationDescription] = useState("");
  const [error, setError] = useState("");
  const [hide, setHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nameError, setDesignationNameError] = useState("");
  const [descriptionError, setDesignationDescriptionError] = useState("");

  useEffect(() => {
    if (props.desId) {
      setIsEdit(true);
      fetchDesignationDetails(props.desId);
    }
  }, [props.desId]);

  const fetchDesignationDetails = async (desId) => {
    try {
      const response = await axios.get(
        `${baseURL}/Designation/GetDesignationById?designationId=${desId}`
      );
      const data = response.data;
      setDesignationName(data.designationName);
      setDesignationDescription(data.designationDescription);
    } catch (error) {
      console.error("Error fetching designation details:", error);
    }
  };

  const validate = () => {
    let isValid = true;

    if (!designationName) {
      setDesignationNameError("Please Enter Designation Name");
      isValid = false;
    }

    if (!designationDescription) {
      setDesignationDescriptionError("Please Enter Designation Description");
      isValid = false;
    }

    return isValid;
  };

  const empCode = sessionStorage.getItem("empCode");

  const handleNameChange = (e) => {
    setDesignationName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDesignationDescription(e.target.value);
  };

  const isDuplicateDesignation = (name, data) => {
    const trimmedName = name.trim().replace(/\s+/g, " ").toLowerCase();
    return data.some(
      (row) => row.designationName.trim().toLowerCase() === trimmedName
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      if (isDuplicateDesignation(designationName, data)) {
        toast.error("A Designation with the same name already exists.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          designationId: isEdit ? props.desId : 0,
          designationName: designationName,
          designationDescription: designationDescription,
          designationStatus: true,
          createdBy: isEdit ? undefined : empCode,
          modifiedBy: empCode,
        };

        let url = `${baseURL}/Designation/CreateDesignation`;
        if (isEdit) {
          url = `${baseURL}/Designation/UpdateDesignation`;
        }

        const res = await axios.post(url, payload);

        if (res.data !== 0) {
          if (isEdit) {
            toast.success("Designation Updated Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
          } else {
            toast.success("Designation Saved Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
            props.refreshData();
            resetForm();
            setHide(false);
            props.showDivData(!hide);
          }
        } /*else {
          setError("A Designation with the same name already exists.");
        } */
      } catch (err) {
        setError("An error occurred while saving the designation.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (validate()) {
      if (
        isDuplicateDesignation(
          designationName,
          data.filter((row) => row.designationId !== props.desId)
        )
      ) {
        toast.error("A Designation with the same name already exists.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          designationId: props.desId,
          designationName: designationName,
          designationDescription: designationDescription,
          designationStatus: true,
          modifiedBy: empCode,
        };
        const response = await axios.post(
          `${baseURL}/Designation/UpdateDesignation`,
          payload
        );

        if (response.data != 0) {
          toast.success("Designation Updated Successfully", {
            position: "top-center",
            closeButton: false,
            autoClose: 2000,
          });
          setIsEdit(false);
          props.refreshData();
          props.showDivData(!hide);
        } else {
          toast.error("Failed to Update Designation", {
            position: "top-center",
            closeButton: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error("Error Updating Designation", {
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
    setDesignationName("");
    setDesignationDescription("");
    setDesignationNameError("");
    setDesignationDescriptionError("");
    setError("");
  };

  const handleCancel = () => {
    setIsEdit(false);
    setHide(false);
    props.showDivData(!hide);
  };

  return (
    <div>
      {hide && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <form
            onSubmit={isEdit ? handleUpdate : handleSubmit}
            className="tondform-css"
          >
            <Grid container>
              <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 3, pr: 1 }}>
                {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Designation Name</DialogTitle> */}
                <FormControl fullWidth error={!!nameError}>
                  <TextField
                    fullWidth
                    id="designationName"
                    label="Designation Name"
                    variant="outlined"
                    value={designationName}
                    onChange={handleNameChange}
                  />
                  {nameError && (
                    <Typography variant="body2" className="errorcss">
                      {nameError}
                    </Typography>
                  )}
                  {error && (
                    <Typography className="errorcss">{error}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 1, pr: 2 }}>
                {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Designation Description</DialogTitle> */}
                <FormControl fullWidth error={!!descriptionError}>
                  <TextField
                    fullWidth
                    minRows={1}
                    id="designationDescription"
                    label="Designation Description"
                    value={designationDescription}
                    onChange={handleDescriptionChange}
                  />
                  {descriptionError && (
                    <Typography variant="body2" className="errorcss">
                      {descriptionError}
                    </Typography>
                  )}
                </FormControl>
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

export default DesignationForm;