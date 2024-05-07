import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegKeyboard } from 'react-icons/fa';
import { BiSolidBellRing } from 'react-icons/bi';

const AddTask = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [listening, setListening] = useState(false);
  const [keyboardClicked, setKeyboardClicked] = useState(false);

  useEffect(() => {
    startListening();
  }, []);

  const startListening = () => {
    if(keyboardClicked==true){
      return;
    }
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
        speak("Tell task name");
      };
      recognition.onend = () => {
        setListening(false);
      };
      let nameRecognized = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (!nameRecognized) {
          if (transcript.toLowerCase().includes('next')) {
            recognition.stop();
          } else {
            console.log(transcript);
            setTaskName(transcript);
            speak("Tell task date");
            startListeningForDate();
          }
        } else {
          if (transcript.toLowerCase().includes('next')) {
            recognition.stop();
          } else {
            console.log(transcript);
            setTaskDate(transcript);
          }
        }
      };
      recognition.start();
    }
  };

  const startListeningForDate = () => {
    
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.toLowerCase().includes('next')) {
          recognition.stop();
        } else {
          console.log(transcript);
          setTaskDate(transcript);
          speak("Tell task time");
          startListeningForTime();
        }
      };
      recognition.start();
    }
  };

  const startListeningForTime = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.toLowerCase().includes('next')) {
          recognition.stop();
        } else {
          console.log(transcript);
          // Extracting time components
          const timeComponents = extractTimeComponents(transcript);
          const { hours, minutes, meridiem } = timeComponents;
          // Combining hours, minutes, and meridiem into a formatted time string
          const formattedTime = `${hours}:${minutes} ${meridiem}`;
          setTaskTime(formattedTime);
        }
      };
      recognition.start();
    }
  };

  // Function to extract time components from transcript
  const extractTimeComponents = (transcript) => {
    // Regular expression to match hours, minutes, and meridiem
    const timeRegex = /(\d{1,2}):(\d{1,2})\s?(am|pm)?/i;
    const match = transcript.match(timeRegex);
    if (match) {
      const hours = match[1];
      const minutes = match[2];
      let meridiem = match[3] || ''; // Default to empty string if meridiem is not specified
      // Convert meridiem to lowercase if present
      if (meridiem) {
        meridiem = meridiem.toLowerCase();
      }
      return { hours, minutes, meridiem };
    } else {
      // If no match found, return default values
      return { hours: '00', minutes: '00', meridiem: '' };
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName || !taskDate || !taskTime) {
      window.alert('Please fill all the fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const taskData = {
      taskname: taskName,
      date: taskDate,
      time: taskTime,
      status: 'assigned',
      notistatus: 'yes',
      userId: userId,
    };
    axios.post('http://localhost:4000/addTask', taskData)
      .then(response => {
        console.log(response.data);
        setTaskName('');
        setTaskDate('');
        setTaskTime('');
        onTaskAdded();
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const stopListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.stop();
    setListening(false);
  };

  const handleKeyboardIconClick = () => {
    stopListening();
    setKeyboardClicked(true);
  };

  return (
    <div className='addtask-container'>
      <div className='addtask-head'>
        <p>Add a Task</p>
        <div className='addtaskhead-left'>
          <p>Add Task -{'\u003E'}</p>
          <FaRegKeyboard size={35} style={{ marginTop: '3px' }} onClick={handleKeyboardIconClick} />
        </div>
      </div>
      <div>
        <form onSubmit={handleAddTask} style={{ marginLeft: '40px' }} className='addtaskinputs'>
          <div>
            <label htmlFor="taskname" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Name</label>
            <input className='input-box' type="text" id="taskname" name="taskname" style={{ marginLeft: '131px', height: '50px', fontSize: '22px' }} value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="taskdate" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Completion Date</label>
            <input className='input-box1' type={keyboardClicked ? "date" : "text"} id="taskdate" name="taskdate" style={{ marginLeft: '55px', height: '50px', fontSize: '25px', textAlign: 'center' }} value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tasktime" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Completion Time</label>
            <input className='input-box2' type={keyboardClicked ? "time" : "text"} id="tasktime" name="tasktime" style={{ marginLeft: '60px', height: '50px', fontSize: '22px', textAlign: 'center' }} value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
          </div>
          <div className='addtaskbtn'>
            <button type="submit" style={{ fontSize: '28px', background: '#37d6cb6c', border: 'none', height: '60px', width: '210px', borderRadius: '15px' }}>Add Task</button>
            <BiSolidBellRing size={38} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTask;
