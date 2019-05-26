'use strict'
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Task = require('../../models/message.js')
process.env.SECRET_KEY = 'secret'

exports.plugin = {
  register: (server, options) => {
    server.route({
      method: 'GET',
      path: '/message',
      handler: (req, h) => {
      try{
        var decoded = jwt.verify(
          req.headers.authorization,
          process.env.SECRET_KEY
        )
        decoded == true
        return Task.findOne({
          _id: mongoose.Types.ObjectId(decoded.id)
        })
      }
      catch{
        err+ 'Пошел нахуй'
      }
      }
    })

    server.route({
      method: 'GET',
      path: '/message/{id}',
      handler: (req, h) => {
        try{
          var decoded = jwt.verify(
            req.headers.authorization,
            process.env.SECRET_KEY
          )
          decoded == true
          console.log('Водка медведи балайка')
          return Task.findOne(
            {
              _id: mongoose.Types.ObjectId(req.params.id)
            },
            (err, doc) => {
              if (err) {
                return err, 'Internal MongoDB error'
              }
  
              if (!doc) {
                return 'Not Found'
              }
  
              return doc
            }
          )
        }
        catch{
          err = err + 'Пошел нахуй'
        }
      }
    })

    server.route({
      method: 'POST',
      path: '/message',
      handler: (req, h) => {
        var decoded = jwt.verify(
          req.headers.authorization,
          process.env.SECRET_KEY
        )
        decoded == true
        console.log('Водка медведи балайка')
        var task = new Task()
        task.title = req.payload.title
        return task.save().then((err, res) => {
          if (err) {
            return err
          }

          return res
        })
      }
    })

    server.route({
      method: 'PUT',
      path: '/message/{id}',
      handler: (req, h) => {
        var decoded = jwt.verify(
          req.headers.authorization,
          process.env.SECRET_KEY
        )
        decoded == true
        console.log('Водка медведи балайка')
        var task = new Task()
        
        return Task.findOneAndUpdate(
          { _id: req.params.id },
          { title: req.payload.title },
          (err, result) => {
            if (err) {
              return err, 'Internal MongoDB error'
            }

            if (result.n === 0) {
              return 'Not Found'
            }

            return 204
          }
        )
      }
    })

    server.route({
      method: 'DELETE',
      path: '/message/{id}',
      handler: (req, h) => {
        var decoded = jwt.verify(
          req.headers.authorization,
          process.env.SECRET_KEY
        )
        decoded == true
        console.log('Водка медведи балайка')
        return Task.deleteOne(
          {
            _id: req.params.id
          },
          (err, result) => {
            if (err) {
              return err, 'Internal MongoDB error'
            }

            if (result.n === 0) {
              return 'Not Found'
            }

            return 204
          }
        )
      }
    })
  },
  name: 'api'
}