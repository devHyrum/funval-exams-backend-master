import Video from '../models/Video.js';
import Grade from '../models/Grade.js';

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

export const gradeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { grade } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    video.grade = grade;
    await video.save();

    // Actualizar la calificación del examen
    const examGrade = await Grade.findOne({ exam: video.exam, student: video.student });
    if (examGrade) {
      examGrade.score = (examGrade.score + Number(grade)) / 2; // Promedio con la calificación anterior
      await examGrade.save();
    }

    res.status(200).json({ message: 'Video calificado con éxito', video });
  } catch (error) {
    console.error('Error al calificar el video:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
