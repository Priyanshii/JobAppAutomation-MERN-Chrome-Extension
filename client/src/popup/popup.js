import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import JobApplicationDetails from './JobApplicationDetails';

const Popup = () => {

  const [locationType, setLocationType] = useState('all');
  const [workType, setWorkType] = useState('all');
  const [jobApplicationCount, setJobApplicationCount] = useState();

  //Start Button click will start auto-applying to Job applications from the job board.
  const handleStartButtonClick = () => {
    const data = {
      ...(locationType !== 'all' && { workplaceType: locationType }),
      ...(workType !== 'all' && { commitment: workType }),
    };

    const searchParams = new URLSearchParams(data);
    const targetURL = `https://jobs.lever.co/spotify?${searchParams.toString()}`

    chrome.runtime.sendMessage({ type: 'startJobAutomation', jobApplicationCount: jobApplicationCount, currentApplicationIndex: 0, targetURL: targetURL });
  };

  return (
    <div className='popup-main-container'>
      <h1>Hello from Jobrobo!</h1>
      <p>Lets Start applying on Jobs.</p>
      <div className='form-group'>
        <div className='input-container'>
          <label htmlFor='jobApplicationCount'>
            Type the number of jobs you want to apply:
          </label>
          <input
            id='jobApplicationCount'
            type='text'
            value={jobApplicationCount}
            onChange={(e) => { setJobApplicationCount(e.target.value) }}
          />
        </div>
        <div className='input-container'>
          <label htmlFor='locationType'>
            Select Location Type
          </label>
          <select
            id='locationType'
            value={locationType}
            onChange={(e) => { setLocationType(e.target.value) }}
          >
            <option value='all'>all</option>
            <option value='onsite'>onsite</option>
            <option value='hybrid'>hybrid</option>
            <option value='remote'>remote</option>
          </select>
        </div>
        <div className='input-container'>
          <label htmlFor='workType'>
            Select Work Type
          </label>
          <select
            id='workType'
            value={workType}
            onChange={(e) => { setWorkType(e.target.value) }}
          >
            <option value='all'>all</option>
            <option value='Full Time Contractor'>Full Time Contractor</option>
            <option value='Permanent'>Permanent</option>
            <option value='Short Term'>Short Term</option>
          </select>
        </div>
        <button className='btn-default' onClick={handleStartButtonClick}>Start</button>
      </div>
      <JobApplicationDetails />
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup-root'));