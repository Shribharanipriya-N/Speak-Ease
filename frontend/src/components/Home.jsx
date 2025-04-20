import React, { useEffect } from "react";
import { RiPencilLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { BiSolidBellRing, BiSolidBellOff } from "react-icons/bi";
import axios from "axios";
import NoTask from "./NoTask";

const Home = ({ tasks, filter, setTasks, onEditTask }) => {
  const token = sessionStorage.getItem("token");
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  useEffect(() => {
    const checkAndUpdateTaskStatus = async () => {
      try {
        const updatedTasks = tasks.map((task) => {
          const taskDateTime = new Date(task.date);
          const timeParts = task.time.split(":").map(Number);
          taskDateTime.setHours(timeParts[0], timeParts[1]);
          const currentDateTime = new Date();

          if (currentDateTime > taskDateTime && task.status !== "done") {
            return { ...task, status: "missing", notistatus: "no" };
          }
          return task;
        });

        setTasks(updatedTasks);

        await Promise.all(
          updatedTasks.map(async (task) => {
            try {
              await axios.put(
                `http://localhost:4000/task/${task.id}`,
                {
                  status: task.status,
                  notistatus: task.notistatus,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log("taskupdated");
            } catch (error) {
              console.error("Error updating task status:", error);
            }
          })
        );
      } catch (error) {
        console.error("Error checking and updating task status:", error);
      }
    };

    const intervalId = setInterval(checkAndUpdateTaskStatus, 30000);

    return () => clearInterval(intervalId);
  }, [tasks, setTasks]);

  const toggleStatus = async (taskId) => {
    try {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: "done", notistatus: "no" };
        }
        return task;
      });

      setTasks(updatedTasks);

      await axios.put(
        `http://localhost:4000/task/${taskId}`,
        { status: "done", notistatus: "no" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const compareDatesAndTimes = (taskA, taskB) => {
    const dateA = new Date(taskA.date);
    const dateB = new Date(taskB.date);
    const timeA = taskA.time.split(":").map(Number);
    const timeB = taskB.time.split(":").map(Number);

    dateA.setHours(timeA[0], timeA[1]);
    dateB.setHours(timeB[0], timeB[1]);

    return dateA - dateB;
  };

  const sortedTasks = [...tasks].sort(compareDatesAndTimes);

  const toggleNotification = async (taskId) => {
    try {
      const updatedTasks = sortedTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            notistatus: task.notistatus === "yes" ? "no" : "yes",
          };
        }
        return task;
      });
      setTasks(updatedTasks);

      await axios.put(
        `http://localhost:4000/task/${taskId}`,
        {
          notistatus: updatedTasks.find((task) => task.id === taskId)
            .notistatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:4000/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredData = sortedTasks.filter((item) => item.status === filter);
  if (filteredData.length === 0) {
    return <NoTask />;
  }

  return (
    <div className="home-container">
      {filteredData.map((item) => (
        <div className={`task-card ${item.status}`} key={item.id}>
          <div className="tasks">
            <IoMdCheckmarkCircleOutline
              style={{ marginLeft: 15 }}
              onClick={() => toggleStatus(item.id)}
            />
            <p className="task-name">{item.taskname}</p>
          </div>
          <div className="task-details">
            <div className="task-tym">
              <p>
                {new Date(item.date).toLocaleDateString()}
                <br />
                {formatTime(item.time)}
              </p>
            </div>
            <div className="icons">
              {item.notistatus === "yes" ? (
                <BiSolidBellRing
                  size={25}
                  onClick={() => toggleNotification(item.id)}
                />
              ) : (
                <BiSolidBellOff
                  size={25}
                  onClick={() => toggleNotification(item.id)}
                />
              )}
              <div className="icon">
                <RiPencilLine size={23} onClick={() => onEditTask(item.id)} />
                <MdDelete size={23} onClick={() => deleteTask(item.id)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
