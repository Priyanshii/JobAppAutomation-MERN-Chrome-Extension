import JobApplication from '../models/JobApplication.js'

export const getJobApplicationsDetails = async (req, res) => {
  try {
    const total = await JobApplication.countDocuments();
    const jobApplications = await JobApplication.find();
    res.status(200).json({ data: jobApplications, total });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getJobApplicationDetailsByUrl = async (req, res) => {
  const { url } = req.query;
  try {
    const details = await JobApplication.findOne({ url });
    console.log(details);
    res.status(200).json({ data: details });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const postJobApplicationQuestions = async (req, res) => {
  try {
    const { url } = req.body;
    const existingObject = await JobApplication.findOne({ url });

    if (!existingObject) {
      const newObject = new JobApplication(req.body);
      await newObject.save();
      res.status(201).json({ message: 'Object created successfully' });
    }
    else {
      res.status(409).json({ message: 'Job Already Exists' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const batchUpdateJobApplicationStatus = async (req, res) => {
  try {
    const updatedJobs = req.body;

    for (const job of updatedJobs) {
      const { url, status } = job;
      await JobApplication.updateOne({ url }, { status });
    }
    res.status(200).json({ message: 'Batch update successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}