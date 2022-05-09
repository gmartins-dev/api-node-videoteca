//Controller -> recebe requisição do cliente <controla/verifica>
//              e depois disso envia para o banco de dados

const { response } = require('express');
const { v4: uuid } = require('uuid');
const Video = require('../models/Video');

module.exports = {
  //rota Index(GET) para buscar todos os videos do bd
  async index(request, response) {
    try {
      const videos = await Video.find(); //busca todos os dados do Model/Schema Video
      return response.status(200).json({ videos });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  //rota Store(POST) para inserir videos no bd
  async store(request, response) {
    const { title, link } = request.body; //recebe json do corpo da requisição

    if (!title || !link) {
      return response.status(400).json({ error: 'missing title or link.' });
    }

    //criando um novo video para ser inserido no bd
    const video = new Video({
      _id: uuid(),
      title,
      link,
      liked: false,
    });

    try {
      await video.save();
      return response.status(201).json({ message: 'Video added successfully!' });
    } catch (err) {
      response.status(400).json({ error: err.message });
    }
  },

  //Rota Update(PUT) para atualizar dados de um video por ID
  async update(request, response) {
    const { title, link } = request.body; //informações vindas por json via request

    if (!title && !link) {
      return response.status(400).json({ error: 'You must inform a new title or a new link.' });
    }

    if (title) response.video.title = title; //atribuindo novo valor ao title
    if (link) response.video.link = link;

    try {
      await response.video.save(); //re-salvando video no banco de dados
      response.status(200).json({ message: 'Video updated successfully!' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  //Rota Delete(DELETE) by id
  async delete(request, response) {
    try {
      await response.video.remove(); //deleta o video que esta salvo no bd
      return response.status(200).json({ message: 'Video deleted successfully!' });
    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  },

  //Rota Likes(PATCH)
  async updateLike(request, response) {
    response.video.liked = !response.video.liked; //atribuindo novo valor/invertendo(shuffle)

    try {
      await response.video.save(); //re-salvando no bd com novas infos(like)

      return response.status(200).json({
        message: `Video ${response.video.liked ? 'liked' : 'unliked'} successfully!`,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};
