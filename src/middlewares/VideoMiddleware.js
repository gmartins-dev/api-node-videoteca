const { validate: isUuid } = require('uuid');
const Video = require('../models/Video');

module.exports = {
  async validateId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid ID.' });
    }

    try {
      const video = await Video.findById(id);
      response.video = video; //adicionando internamente(no banco de dados) o video ao nosso response
      if (!video) {
        return response.status(400).json({ error: 'Video not found.' });
      }
    } catch (err) {
      return response.status(500).json({ error: err.message });
    }

    next();
  },
};
