const axios = require('axios');

exports.uploadResume = async (req, res) => {
  try {
    const formData = new FormData();
    
    if (req.file) {
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
    }

    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const response = await axios.post(`${fastApiUrl}/resume/upload`, formData, {
      headers: formData.getHeaders ? formData.getHeaders() : {}
    });

    req.user.dailyResumeUploads += 1;
    await req.user.save();

    res.status(200).json({
      success: true,
      data: response.data,
      remaining: require('../config/constants').MAX_DAILY_RESUME_UPLOADS - req.user.dailyResumeUploads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to upload resume'
    });
  }
};
