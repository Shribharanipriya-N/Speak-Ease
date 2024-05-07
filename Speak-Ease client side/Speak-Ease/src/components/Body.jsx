import React, { useState,useEffect } from 'react';

import NavBar from './NavBar';
import Dashboard from './Dashboard';
import Buttons from './Buttons';
import AddTask from './AddTask';
import Home from './Home';
import '../index.css'
import axios from 'axios';


const Body=()=> {
  const [statusFilter, setStatusFilter] = useState('assigned');
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    // Fetch tasks for the logged-in user
    const fetchTasks = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:4000/userTasks/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const calculateTaskCounts = () => {
    const assignedTasks = tasks.filter(task => task.status === 'assigned').length;
    const missingTasks = tasks.filter(task => task.status === 'missing').length;
    const doneTasks = tasks.filter(task => task.status === 'done').length;
    const totalTasks = tasks.length;

    return { assignedTasks, missingTasks, doneTasks, totalTasks };
  };

  useEffect(() => {
    const { assignedTasks, missingTasks, doneTasks, totalTasks } = calculateTaskCounts();
    setCounts({ assignedTasks, missingTasks, doneTasks, totalTasks });
  }, [tasks]);

  const [counts, setCounts] = useState(calculateTaskCounts());
  const handleAddTaskClick = () => {
    setShowAddTask(true);
  };

  const handleTaskAdded = async() => {
    setShowAddTask(false);
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:4000/userTasks/${userId}`);
      setTasks(response.data); // Update tasks with the latest data
    } catch (error) {
      console.error('Error fetching updated tasks:', error);
    }
    
  };
  return (
    <>
      <NavBar />
      <div className='style1'>
        <Dashboard assignedTasks={counts.assignedTasks} missingTasks={counts.missingTasks} doneTasks={counts.doneTasks} totaltask={counts.totalTasks} onAddTaskClick={handleAddTaskClick}/>
        <div className='style2'>
          <Buttons setFilter={setStatusFilter} filter={statusFilter}onButtonClick={() => setShowAddTask(false)}/>
          {showAddTask ? (
            <AddTask onTaskAdded={handleTaskAdded} />
          ) : (
            <Home tasks={tasks} setTasks={setTasks} filter={statusFilter} />
          )}

        </div>
      </div>
    </>
  );
}

export default Body;