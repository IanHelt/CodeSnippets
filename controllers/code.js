const Code = require('../models/code');
const User = require('../models/user');

var CodeController = {
  list: function(req, res) {
    userId = req.user.id;
    Code.find({
      userId: userId
    }).then(function(snippets) {
      res.render('code/list', {
        code: snippets,
      })
    });
  },
  form: function(req, res) {
    let userId = req.user.id;
    User.findOne({
      _id: userId
    }).then(function(user) {
      res.render('code/form', user);
      return;
    });
  },
  updateForm: function(req, res) {
    let codeId = req.params.id;
    Code.findById(codeId).then(function(code) {
      res.render('code/updateForm', code);
    });
  },
  add: function(req, res) {
    var userId = req.user.id;
    var title = req.body.title;
    var body = req.body.body;
    var notes = req.body.notes;
    var language = req.body.language;
    var tagsString = req.body.tag;
    var tagsArray = tagsString.split(',');
    var newCode = new Code({
      userId: userId,
      title: title,
      body: body,
      notes: notes,
      language: language,
      tags: tagsArray
    });
    newCode.save(function(err, code) {
      res.redirect('/code');
    });
  },
  delete: function(req, res) {
    let codeId = req.params.id;
    Code.deleteOne({
      "userId": req.user.id,
      "_id": codeId
    }).then(function() {
      res.redirect('/code');
    })
  },
  update: function(req, res) {
    let codeId = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let notes = req.body.notes;
    let tagsString = req.body.tag;
    let tagsArray = tagsString.split(',');
    let language = req.body.language;
    Code.findByIdAndUpdate(codeId, {
      $set: {
        title: title,
        body: body,
        notes: notes,
        language: language,
        tags: tagsArray
      }
    }).then(function() {
      res.redirect('/code/');
    });
  },
  langsearch: function(req, res) {
    let userId = req.user.id;
    let search = req.body.languagesearch;
    console.log(search);
    Code.find({
    language : search
    }).then(function(code) {
      res.render('code/codeFilter', {
        snippets: code
      });
    })
  },
  tagsearch: function(req, res) {
    let userId = req.user.id;
    let search = req.body.tagsearch;
    Code.find({
      tags: search
    }).then(function(code) {
      res.render('code/codeFilter', {
        snippets: code
      });
    })
  }
};
module.exports = CodeController;
