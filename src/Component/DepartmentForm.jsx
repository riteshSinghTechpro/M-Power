import React, { useState, useEffect } from "react";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

function DepartmentForm(props) {
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    if (!props.showDivData) {
      resetForm();
    } else if (props.departmentId && props.departmentName) {
      setIsEdit(true);
      setDepartmentName(props.departmentName);
    }
  }, [props.showDivData, props.departmentId, props.departmentName]);

  const handleNameChange = (e) => {
    setDepartmentName(e.target.value);
    if (e.target.value) {
      setNameError("");
    }
  };

  const spaceControlDepartmentName = (deptName) => {
    return deptName.trim().replace(/\s+/g, " ").toLowerCase();
  };

  const validate = () => {
    let isValid = true;
    const trimmedDepartmentName = departmentName.trim();

    if (!trimmedDepartmentName) {
      setNameError("Please enter Department Name");
      isValid = false;
    } else {
      const existingDepartments = props.existingDepartments || [];
      const normalizedInputName = spaceControlDepartmentName(
        trimmedDepartmentName
      );

      const isDuplicate = existingDepartments.some(
        (dept) =>
          spaceControlDepartmentName(dept.departmentName) ===
          normalizedInputName
      );

      if (isDuplicate) {
        toast.error("A Department with the same name already exists.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const payload = {
          departmentId: isEdit ? props.departmentId : 0,
          departmentName: departmentName,
        };

        const res = await axios.post(
          `${baseURL}/Department/SaveUpdateDepartment`,
          payload
        );

        if (res.data !== 0) {
          toast.success(
            isEdit
              ? "Department Updated Successfully"
              : "Department Saved Successfully",
            {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            }
          );
          props.refreshData();
          props.showDivData(false);
          resetForm();
        } else {
          setNameError("A Department with the same name already exists.");
        }
      } catch (err) {
        setNameError("A Department with the same name already exists.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setDepartmentName("");
    setNameError("");
    setIsEdit(false);
  };

  const handleCancel = () => {
    resetForm();
    props.showDivData(false);
  };

  return (
    <div>
      {hide && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <form onSubmit={handleSubmit} className="tondform-css">
            <Grid container>
              <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 3, pr: 0 }}>
                <DialogTitle sx={{ pl: 0, pr: 0 }}>Department Name</DialogTitle>
                <TextField
                  fullWidth
                  id="department"
                  label="Department"
                  variant="outlined"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  sx={{ mt: 2 }}
                />
                {nameError && (
                  <Typography color="error">{nameError}</Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ mt: 2, mb: 2, pl: 2, pr: 2 }}
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

export default DepartmentForm;