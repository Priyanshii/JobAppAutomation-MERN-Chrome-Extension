import React, { useState } from 'react'
import '../index.css';
import axios from "axios";

const JobApplicationDetails = () => {

  const [jobApplicationDetails, setJobApplicationDetails] = useState([]);
  const [showJobQuestions, setShowJobQuestions] = useState({});

  const handleFetchJobApplicationQuestions = async (url) => {
    console.log(url);
    try {
      const response = await axios.get(`http://localhost:5000/api/job-application-details/url?url=${url}`);
      console.log(response.data);
      setShowJobQuestions({
        ...showJobQuestions,
        [url]: !showJobQuestions[url]
      })
    } catch (error) {
      console.error(error);
    }
  }

  const getJobApplicationsDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/job-application-details/`);
      console.log(response.data);
      setJobApplicationDetails(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='job-details-container'>
      <button className='btn-primary' onClick={getJobApplicationsDetails}>
        Get Details of Submitted Job Applications
      </button>
      {
        jobApplicationDetails?.length > 0
        &&
        <div className='job-applications-container'>
          {
            jobApplicationDetails?.map((job, jobIndex) => {
              return (
                <div className='job-card-container'>
                  <div>
                    <span className='job-card-title'>{`${jobIndex + 1}.  Job Title : ${job.title}`}
                      <a href={job.url} className='job-link'>{job.url}</a>
                    </span>
                  </div>
                  <div className='job-status'>{`Status:  `}
                    <span>{job.status}</span>
                  </div>
                  <button
                    onClick={() => { handleFetchJobApplicationQuestions(job.url) }}
                    className='btn-default'
                  >
                    Show Job Application Form Questions
                  </button>
                  {
                    showJobQuestions[job.url]
                    &&
                    <>
                      <span className='questions-heading'>
                        Questions on the Application Form
                      </span>
                      <div className='job-questions-container'>
                        {
                          job.questions.map((question, index) => {
                            if (question.text.endsWith('✱')) {
                              question.text = question.text.slice(0, -1);
                            }
                            return (
                              <div className='question-card'>
                                <span>
                                  {`${index + 1}. ${question.text}`}
                                </span>
                                <span>
                                  {`Type: ${question.type}`}
                                </span>
                                <div className='question-options'>
                                  <span>Options: </span>
                                  {
                                    question.options.map((option, optionIndex) => {
                                      return <span>{`${optionIndex + 1}. ${option}`}</span>
                                    })
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </>
                  }
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}

export default JobApplicationDetails;