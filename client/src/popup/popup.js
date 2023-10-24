import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import axios from "axios";

const Popup = () => {

  const [locationType, setLocationType] = useState('all');
  const [workType, setWorkType] = useState('all');
  const [jobApplicationCount, setJobApplicationCount] = useState();
  const [jobApplicationDetails, setJobApplicationDetails] = useState([]);

  const handleClick = () => {
    const data = {
      ...(locationType !== 'all' && { workplaceType: locationType }),
      ...(workType !== 'all' && { commitment: workType }),
    };

    const searchParams = new URLSearchParams(data);
    const targetURL = `https://jobs.lever.co/spotify?${searchParams.toString()}`

    chrome.runtime.sendMessage({ type: 'startJobAutomation', jobApplicationCount: jobApplicationCount, currentApplicationIndex: 0, targetURL: targetURL });
  };

  const getJobApplicationsDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/job-application-details/`);
      console.log(response.data);
      setJobApplicationDetails(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleLocationType = (e) => {
    setLocationType(e.target.value);
  }

  const handleWorkType = (e) => {
    setWorkType(e.target.value);
  }

  return (
    <div className='popup'>
      <h1>Hello from Jobrobo!</h1>
      <p>Lets Start applying on Jobs.</p>
      <div className='question'>
        <label htmlFor='jobApplicationCount'>Type the number of jobs you want to apply</label>
        <input id='jobApplicationCount' type='text' value={jobApplicationCount} onChange={(e) => { setJobApplicationCount(e.target.value) }} />
      </div>
      <div className='question'>
        <label htmlFor='locationType' >Select Location Type</label>
        <select id='locationType' value={locationType} onChange={handleLocationType}>
          <option value='all'>all</option>
          <option value='onsite'>onsite</option>
          <option value='hybrid'>hybrid</option>
          <option value='remote'>remote</option>
        </select>
      </div>
      <div className='question'>
        <label htmlFor='workType' >Select Work Type</label>
        <select id='workType' value={workType} onChange={handleWorkType}>
          <option value='all'>all</option>
          <option value='Full Time Contractor'>Full Time Contractor</option>
          <option value='Internship'>Internship</option>
          <option value='Permanent'>Permanent</option>
        </select>
      </div>
      <button onClick={handleClick}>Start applying on Jobs</button>
      <button onClick={getJobApplicationsDetails}>Get Details of Submitted Job Applications</button>
      {
        jobApplicationDetails?.length > 0
        &&
        <div className='jobApplications'>
          {
            jobApplicationDetails?.map((job, jobIndex) => {
              return (
                <div className='specificJob'>
                  <div>
                    <span className='applicationTitle'>{`${jobIndex + 1}.  Job URL :`}
                      <a href={job.url} className='jobLink'>{job.url}</a>
                    </span>
                  </div>
                  <span className='questionTitle'>Questions on the Application Form</span>
                  <div className='questionsArray'>
                    {
                      job.questions.map((question, index) => {
                        if (question.text.endsWith('✱')) {
                          question.text = question.text.slice(0, -1);
                        }
                        return (
                          <div className='question'>
                            <span>
                              {`${index + 1}. ${question.text}`}
                            </span>
                            <span>
                              {`Type: ${question.type}`}
                            </span>
                            <div className='options'>
                              <span>Options: </span>
                              {
                                question.options.map((option, optionIndex) => {
                                  return <span>{`${optionIndex+1}. ${option}`}</span>
                                })
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <span className='title'>Status:
                    <span>{job.status}</span>
                  </span>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup-root'));