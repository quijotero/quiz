var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  //Por defecto busca todas las preguntas
  var search="%",filtro="";
  //Comprubea que existe un filtrado seleccionado buscando el parámetro 'search'
  if (typeof req.query.search !== "undefined") {
    //Recoge el parametro y le reemplaza espacios por % y pone % al principio y final
    filtro = req.query.search;
    search = "%" + filtro + "%";
    search = search.replace(/ +/g,'%');
  }
  //Busca todas las preguntas que cumplen con el filtro
  models.Quiz.findAll(  {where: ["pregunta like ?", search]}    ).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, filtrado: filtro});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
