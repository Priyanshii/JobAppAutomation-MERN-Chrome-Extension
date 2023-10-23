import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../index.css';

const Popup = () => {

  const [locationType, setLocationType] = useState('all');
  const [workType, setWorkType] = useState('all');
  const [jobApplicationCount, setJobApplicationCount] = useState();

  const handleClick = () => {
    const data = {
      ...(locationType !== 'all' && { workplaceType: locationType }),
      ...(workType !== 'all' && { commitment: workType }),
    };
    
    const searchParams = new URLSearchParams(data);
    
    console.log(searchParams);
    // const targetURL = (locationType === 'all') ? `https://jobs.lever.co/spotify` : `https://jobs.lever.co/spotify?workplaceType=${locationType}`
    const targetURL = `https://jobs.lever.co/spotify?${searchParams.toString()}`

    chrome.runtime.sendMessage({ type: 'startJobAutomation', jobApplicationCount: jobApplicationCount, currentApplicationIndex: -1, targetURL: targetURL });
  };

  const handleLocationType = (e) => {
    setLocationType(e.target.value);
  }

  const handleWorkType = (e) => {
    setWorkType(e.target.value);
  }

  return (
    <div className='popup'>
      <h1>Hello from Popup!</h1>
      <p>Lets Start applying on Jobs.</p>
      <div className='question'>
        <label htmlFor='jobApplicationCount'>Type the number of jobs you want to apply</label>
        <input name='jobApplicationCount' type='text' value={jobApplicationCount} onChange={(e) => { setJobApplicationCount(e.target.value) }} />
      </div>
      <div className='question'>
        <label htmlFor='locationType' >Select Location Type</label>
        <select name='locationType' value={locationType} onChange={handleLocationType}>
          <option value='all'>all</option>
          <option value='onsite'>onsite</option>
          <option value='hybrid'>hybrid</option>
          <option value='remote'>remote</option>
        </select>
      </div>
      <div className='question'>
        <label htmlFor='workType' >Select Work Type</label>
        <select name='workType' value={workType} onChange={handleWorkType}>
          <option value='all'>all</option>
          <option value='Full Time Contractor'>Full Time Contractor</option>
          <option value='Internship'>Internship</option>
          <option value='Permanent'>Permanent</option>
        </select>
      </div>
      <button onClick={handleClick}>Start applying on Jobs</button>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup-root'));