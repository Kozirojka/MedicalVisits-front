import React, { useState } from "react";
import { BASE_API } from "../../constants/BASE_API";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";

async function createVisitRequest(visitData) {
  try {
    visitData.dateTime = new Date(visitData.dateTime).toISOString();
    visitData.dateTimeEnd = new Date(visitData.dateTimeEnd).toISOString();

    const token = localStorage.getItem("accessToken");
    console.log("Дані, які надсилаються:", visitData);
    console.log(token);
    const response = await fetch(`${BASE_API}/Patient/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(visitData),
    });

    if (!response.ok) {
      throw new Error("Помилка при створенні запиту");
    }

    return await response.json();
  } catch (error) {
    console.error("Помилка:", error);
    throw error;
  }
}

export default function CreateVisitModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [visitData, setVisitData] = useState({
    dateTime: "",
    dateTimeEnd: "",
    description: "",
    address: "",
    isRegular: false,
    hasMedicine: false,
    requiredMedications: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVisitData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createVisitRequest(visitData);
      onClose();
      alert("Запит створено успішно!");
    } catch (error) {
      setError("Не вдалося створити запит. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Create Visit Request</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <FormGroup>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Start Date and Time"
              type="datetime-local"
              name="dateTime"
              value={visitData.dateTime}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="End Date and Time"
              type="datetime-local"
              name="dateTimeEnd"
              value={visitData.dateTimeEnd}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Address"
              name="address"
              value={visitData.address}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={visitData.isRegular}
                onChange={handleInputChange}
                name="isRegular"
              />
            }
            label="Is Regular"
          />

          <FormControl fullWidth margin="normal">
            <TextField
              label="Description"
              name="description"
              value={visitData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={visitData.hasMedicine}
                onChange={handleInputChange}
                name="hasMedicine"
              />
            }
            label="Need Medications"
          />

          {visitData.hasMedicine && (
            <FormControl fullWidth margin="normal">
              <TextField
                label="Required Medications"
                name="requiredMedications"
                value={visitData.requiredMedications}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
              />
            </FormControl>
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
