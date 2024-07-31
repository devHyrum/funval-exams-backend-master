import Video from '../models/Video.js';

export const uploadVideo = async (req, res) => {
  try {
    const { examId } = req.body;
    const video = new Video({
      user: req.user._id,
      exam: examId,
      videoUrl: req.file.path
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user._id }).populate('exam');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};