import React, { useContext, useState } from "react";
import { userLoggedIn } from "../../context/context";
import { Todo, User, taskValues } from "../../interface/interface";
import Header from "../../components/header/header";
import styles from "../../styles/pages/dashboard.module.scss";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { InputField } from "../../components/inputField/inputField";
import { STRING } from "../../controller/string";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";

let taskType: "task" | "subTask" | "" = "task";
let currentEditTaskId: string = "";
let currentEditSubTaskId: string = "";

const Dashboard = () => {
  const initialValues: taskValues = {
    task: "",
  };
  const user: User | null = useContext(userLoggedIn);
  const [taskData, setTodoData] = useState<Todo[]>([]);
  const [subTaskInput, setTaskInput] = useState<string>("");
  const [editModel, setEditModel] = useState(false);
  const [updateInput, setUpdateInput] = useState("");


  const onAddSubTask = (taskId: string) => {
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      if (subTaskInput && user?.id) {
        let data: Todo = {
          id: crypto.randomUUID(),
          userId: user?.id!,
          title: subTaskInput,
          completed: false,
          subTask: [],
        };
        taskData[taskIndex].subTask?.push(data);
        setTodoData(taskData);
        setTaskInput("");
        setUpdateInput("");
      }
    }
  };

  const taskSchema = Yup.object({
    task: Yup.string().required("Task is required"),
  });

  const handleSubmit = (values: taskValues) => {
    if (values.task && user?.id) {
      let data: Todo = {
        id: crypto.randomUUID(),
        userId: user?.id!,
        title: values.task,
        completed: false,
        subTask: [],
      };
      setTodoData((prev) => [...prev, data]);
    }
  };

  const onDeleteTask = (taskId: string) => {
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    taskData.splice(taskIndex, 1);
    setTodoData([...taskData]);
  };

  const onDeleteSubTask = (taskId: string, subTaskId: string) => {
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    const subTaskIndex = taskData[taskIndex].subTask?.findIndex(
      (subTask) => subTask.id === subTaskId
    );

    taskData[taskIndex].subTask?.splice(subTaskIndex!, 1);
    setTodoData([...taskData]);
  };

  const updateTask = () => {
    const index: number = taskData.findIndex(
      (task) => task.id === currentEditTaskId
    );
    if (index === -1) {
      return;
    }
    if (taskType === "task") {
      taskData[index].title = updateInput;
    } else {
      const subIndex = taskData[index].subTask?.findIndex(
        (subTask) => subTask.id === currentEditSubTaskId
      );
      if (subIndex !== undefined && subIndex !== -1) {
        taskData[index].subTask[subIndex].title = updateInput;
      }
    }
    setTodoData([...taskData]);
    setEditModel(false);
    currentEditSubTaskId = "";
    currentEditSubTaskId = "";
    taskType = "";
  };

  return (
    <div>
      <Header />

      <div className={styles.mainContainer}>
        <h1>{STRING.ALL_TASKS}</h1>
        <div className={styles.taskContainer}>
          {taskData &&
            taskData.map((task: Todo) => {
              return (
                <div key={task.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <div>
                        <Typography>{task.title}</Typography>

                        <Typography>
                          <IconButton
                            onClick={() => {
                              currentEditTaskId = task.id;
                              taskType = "task";
                              setUpdateInput(task.title);
                              setEditModel(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton onClick={() => onDeleteTask(task.id)}>
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      {task.subTask &&
                        task.subTask.map((subTask) => {
                          return (
                            <ListItem
                              key={subTask.id}
                              secondaryAction={
                                <div>
                                  <IconButton
                                    edge="end"
                                    onClick={() => {
                                      currentEditTaskId = task.id;
                                      currentEditSubTaskId = subTask.id;
                                      setUpdateInput(subTask.title);
                                      taskType = "subTask";
                                      setEditModel(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    edge="end"
                                    onClick={() =>
                                      onDeleteSubTask(task.id, subTask.id)
                                    }
                                  >
                                    <DeleteIcon color="error"></DeleteIcon>
                                  </IconButton>
                                </div>
                              }
                              disablePadding
                            >
                              <ListItemButton dense>
                                <ListItemIcon>
                                  <Checkbox />
                                </ListItemIcon>
                                <ListItemText
                                  id={subTask.id}
                                  primary={subTask.title}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      <div className="d-flex gap-2 align-items-end">
                        <TextField
                          variant="standard"
                          label="sub task"
                          type="text"
                          size="small"
                          className="w-100"
                          onChange={(e: any) => setTaskInput(e.target.value)}
                        />
                        <div>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => onAddSubTask(task.id)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
        </div>

        <div className={styles.inputContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={taskSchema}
            onSubmit={handleSubmit}
          >
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <InputField
                  label="Task"
                  name="task"
                  placeholder="Enter Task"
                  type="text"
                />
              </div>
              <button className={styles.submitButton} type="submit">
                {STRING.ADD_TASK}
              </button>
            </Form>
          </Formik>
        </div>
      </div>

      <Dialog open={editModel} onClose={() => setEditModel(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="task"
            type="text"
            fullWidth
            variant="standard"
            value={updateInput}
            onChange={(e: any) => setUpdateInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModel(false)}>Cancel</Button>
          <Button onClick={() => updateTask()}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
