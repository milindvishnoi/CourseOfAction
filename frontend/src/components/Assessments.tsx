import React, { useState, Dispatch, SetStateAction } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { Assessment } from "../store/courses";

interface lstType {
  tableData: Assessment[];
  setTableData: Dispatch<SetStateAction<Assessment[]>>;
  save: {
    function: Function; // function to call when enabled
    disabled: boolean; // enable only when save function can work
  } | null;
  course: string;
}

function Assessments({ tableData, setTableData, save, course }: lstType) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addAsssessmentInfo, setAddAsssessmentInfo] = useState<Assessment>({
    name: "",
    reminder: "", // Need to be date, error in database
    deadline: "", // Need to be date, error in database
    mark: -1,
    weight: 0,
  });
  const [addAssessmentErrors, setAddAssessmentErrors] = useState({
    name: false,
    weight: false,
  });

  const deleteAssesments = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setTableData((tableData) =>
          tableData.filter((row) => course + "-" + row.name !== id)
        );
      });
    },
    []
  );

  const handleAddAssessment = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string
  ) => {
    switch (field) {
      case "name":
        setAddAsssessmentInfo((addAssessment) => ({
          ...addAssessment,
          name: e.target.value,
        }));
        setAddAssessmentErrors({
          ...addAssessmentErrors,
          name:
            tableData.filter((data) => data.name === e.target.value).length !==
            0,
        });
        break;
      case "weight":
        setAddAsssessmentInfo((addAssessment) => ({
          ...addAssessment,
          weight: Number(e.target.value),
        }));
        setAddAssessmentErrors({
          ...addAssessmentErrors,
          weight:
            tableData
              .map((data) => data.weight)
              .reduce((prev, next) => prev + next, 0) +
              Number(e.target.value) >
            100,
        });
        break;
    }
  };

  const columns = [
    //   { field: "id", headerName: "ID", width: 0 },
    //   { field: "status", headerName: "Status", width: 100 },
    {
      field: "name",
      headerName: "Assessment",
      editable: true,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "weight",
      headerName: "Weight",
      editable: true,
      type: "number",
      flex: 0.5,
    },
    {
      field: "mark",
      headerName: "Mark",
      editable: true,
      type: "number",
      flex: 0.5,
      valueFormatter: (params: any) => {
        if (params.value && (params.value === null || params.value === -1))
          return "-";
        else return params.value;
      },
      hide: save === null,
    },
    {
      field: "deadline",
      headerName: "Due Date",
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "date",
      valueFormatter: (params: any) => {
        if (params.value && params.value !== "")
          return moment(params.value).format("YYYY-MM-DD");
        else return "";
      },
    }, //, type: "date"
    {
      field: "reminder",
      headerName: "Reminder",
      editable: true,
      inWidth: 200,
      flex: 1,
      type: "date",
      valueFormatter: (params: any) => {
        if (params.value && params.value !== "")
          return moment(params.value).format("YYYY-MM-DD");
        else return "";
      },
    }, //, type: "date"
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params: { id: any }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteAssesments(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
        mx={3}
        my={2}
      >
        <Typography variant="h2">Assessments</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ color: "white" }}
            onClick={() => setIsAddOpen(true)}
          >
            Add Assessment
          </Button>
          {save ? (
            <Button
              variant="outlined"
              color="success"
              size="medium"
              onClick={() => save.function()}
              disabled={save.disabled}
            >
              Save
            </Button>
          ) : null}
        </Stack>
      </Box>
      <Box
        sx={{ backgroundColor: "highlight.main", borderRadius: 2 }}
        p={2}
        mx={3}
        my={2}
        width="full"
        height="100%"
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <DataGrid
              getRowId={(row) => course + "-" + row.name}
              rows={tableData}
              columns={columns}
              autoHeight
              onCellEditCommit={(params: GridCellEditCommitParams) => {
                setTimeout(() => {
                  const index = tableData.findIndex(
                    (element) => course + "-" + element.name === params.id
                  );
                  if (index === -1) return;
                  setTableData([
                    ...tableData.filter(
                      (row) => course + "-" + row.name !== params.id
                    ),
                    { ...tableData[index], [params.field]: params.value },
                  ]);
                });
              }}
              initialState={{
                sorting: {
                  sortModel: [
                    {
                      field: "name",
                      sort: "asc",
                    },
                  ],
                },
              }}
            />
          </div>
        </div>
        {/* Add Assessment Dialog */}
        <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
          <DialogTitle>Add Assessment</DialogTitle>
          <DialogContent>
            <DialogContentText color="text.main">
              Please fill in the following details to create an assessment.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Assignment name"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                handleAddAssessment(e, "name");
              }}
              error={addAssessmentErrors.name}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Weightage"
              type="number"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                handleAddAssessment(e, "weight");
              }}
              error={addAssessmentErrors.weight}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Deadline date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  deadline: moment(e.target.value).toString(),
                }));
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Notification date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  reminder: moment(e.target.value).toString(),
                }));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsAddOpen(false);
                setAddAssessmentErrors({
                  name: false,
                  weight: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setTableData([...tableData, addAsssessmentInfo]);
                setIsAddOpen(false);
              }}
              disabled={
                addAssessmentErrors.name ||
                addAssessmentErrors.weight ||
                addAsssessmentInfo.name.length === 0 ||
                addAsssessmentInfo.weight === 0
              }
            >
              Add Assessment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

Assessments.defaultProps = {
  save: null,
};

export default Assessments;
