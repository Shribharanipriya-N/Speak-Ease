import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Buttons from "./Buttons";
import AddTask from "./AddTask";
import Home from "./Home";
import "../index.css";
import axios from "axios";
import UpdateTask from "./UpdateTask";

const Body = () => {
  const [statusFilter, setStatusFilter] = useState("assigned");
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [counts, setCounts] = useState({
    assignedTasks: 0,
    missingTasks: 0,
    doneTasks: 0,
    totalTasks: 0,
  });

  const token = sessionStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/task", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const assignedTasks = tasks.filter(
      (task) => task.status === "assigned"
    ).length;
    const missingTasks = tasks.filter(
      (task) => task.status === "missing"
    ).length;
    const doneTasks = tasks.filter((task) => task.status === "done").length;
    const totalTasks = tasks.length;

    setCounts({ assignedTasks, missingTasks, doneTasks, totalTasks });
  }, [tasks]);

  const handleAddTaskClick = () => {
    setShowAddTask(true);
    setShowUpdateTask(false);
  };

  const handleTaskAdded = async () => {
    setShowAddTask(false);
    await fetchTasks();
  };

  const handleEditTask = (taskId) => {
    setSelectedTaskId(taskId);
    setShowUpdateTask(true);
    setShowAddTask(false);
  };

  const handleTaskUpdated = async () => {
    setShowUpdateTask(false);
    setSelectedTaskId(null);
    await fetchTasks();
  };

  const clearSelectedTask = () => {
    setSelectedTaskId(null);
    setShowUpdateTask(false);
  };

  const stopRecognition = () => {
    const recognition = window.recognitionInstance;
    if (recognition) {
      recognition.abort();
      window.recognitionInstance = null;
    }
  };

  const handleButtonClick = () => {
    setShowAddTask(false);
    setShowUpdateTask(false);
    stopRecognition();
    clearSelectedTask();
  };

  return (
    <>
      <NavBar />
      <div className="style1">
        <Dashboard
          assignedTasks={counts.assignedTasks}
          missingTasks={counts.missingTasks}
          doneTasks={counts.doneTasks}
          totaltask={counts.totalTasks}
          onAddTaskClick={handleAddTaskClick}
        />
        <div className="style2">
          <Buttons
            setFilter={setStatusFilter}
            filter={statusFilter}
            onButtonClick={handleButtonClick}
          />
          {showAddTask && <AddTask onTaskAdded={handleTaskAdded} />}
          {showUpdateTask && selectedTaskId && (
            <UpdateTask
              taskId={selectedTaskId}
              setTasks={setTasks}
              clearSelectedTask={clearSelectedTask}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
          {!showAddTask && !showUpdateTask && (
            <Home
              tasks={tasks}
              setTasks={setTasks}
              filter={statusFilter}
              onEditTask={handleEditTask}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Body;
