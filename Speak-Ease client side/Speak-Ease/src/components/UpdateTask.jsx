import React, { useState, useEffect } from 'react';
import { FaRegKeyboard } from 'react-icons/fa';
import { BiSolidBellRing, BiSolidBellOff } from 'react-icons/bi';
import axios from 'axios';

const UpdateTask = ({ taskId, setTasks, clearSelectedTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [notiStatus, setNotiStatus] = useState('');
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/taskDetails/${taskId}`);
        const { taskname, date, time,notistatus } = response.data;

        // Set task details
        setTaskName(taskname);
        setTaskDate(formatDate(date));
        setTaskTime(formatTime(time));
        setNotiStatus(notistatus);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);
  const toggleNotiStatus = () => {
    setNotiStatus(prevStatus => prevStatus === 'yes' ? 'no' : 'yes');
  };

  // Function to format the date string to display only the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to format the time string to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const ampm = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!taskName || !taskDate || !taskTime) {
      window.alert('Please fill all the fields.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/updateTask/${taskId}`, {
        taskname: taskName,
        date: taskDate,
        time: taskTime,
        status: 'assigned',
        notistatus: 'yes'
      });

      // Fetch tasks again to reflect the updated task in the UI
      fetchTasks();

      // Clear input fields and update task list
      setTaskName('');
      setTaskDate('');
      setTaskTime('');
      clearSelectedTask();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:4000/userTasks/${userId}`);
      setTasks(response.data);// Assuming setTasks updates the state with the tasks data
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className='updatetask-container'>
      <div className='updatetask-head'>
        <p>Update a Task</p>
        <div className='updatetaskhead-left'>
          <p>Update Task -{'\u003E'}</p>
          <FaRegKeyboard size={35} style={{ marginTop: '3px' }} />
        </div>
      </div>
      <div>
        <form onSubmit={handleUpdateTask} style={{ marginLeft: '40px' }} className='updatetaskinputs'>
          <div>
            <label htmlFor="taskname" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Name</label>
            <input className='input-box' type="text" id="taskname" name="taskname" style={{ marginLeft: '131px', height: '50px', fontSize: '22px' }} value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="taskdate" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Completion Date</label>
            <input className='input-box1' type="text" id="taskdate" name="taskdate" style={{ marginLeft: '55px', height: '50px', fontSize: '25px', textAlign: 'center' }} value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tasktime" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Completion Time</label>
            <input className='input-box2' type="text" id="tasktime" name="tasktime" style={{ marginLeft: '60px', height: '50px', fontSize: '22px', textAlign: 'center' }} value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
          </div>
          <div className='updatetaskbtn'>
            <button type="submit" style={{ fontSize: '28px', background: '#eddc8adc', border: 'none', height: '60px', width: '210px', borderRadius: '15px' }}>Update Task</button>
            {notiStatus === 'yes' ? (
              <BiSolidBellRing size={38} onClick={toggleNotiStatus} />
            ) : (
              <BiSolidBellOff size={38} onClick={toggleNotiStatus} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
