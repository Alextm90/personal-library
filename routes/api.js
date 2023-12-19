/*
 *       Complete the API routing below
 */
"use strict";
const { ObjectId } = require("mongodb");
const Books = require("../models.js");
const db = require("../dbConnection.js");
const mongoose = require("mongoose");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      const bookList = await Books.find({});
      res.json(bookList);
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;
      if (!title) {
        res.json("missing required field title");
      } else {
        const newBook = new Books({ title });
        await newBook.save();
        res.json({ title: title, _id: newBook._id });
      }
    })

    .delete(async function (req, res) {
      const deleted = await Books.deleteMany({});
      if (deleted) return res.json("complete delete successful");
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      try {
        const bookid = req.params.id;
        const singleBook = await Books.findById(bookid);
        if (!singleBook) {
          return res.json("no book exists");
        } else {
          return res.json({
            title: singleBook.title,
            _id: singleBook._id,
            comments: [],
          });
        }
      } catch (error) {
        res.json("no book exists");
      }
    })

    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) return res.json("missing required field comment");

      try {
        const book = await Books.findById(bookid);
        if (!book) return res.json("no book exists");

        book.comments.push(comment);
        book.commentcount++;

        await book.save();

        return res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.commentcount,
        });
      } catch (error) {
        return res.json("no book exists");
      }
    })

    .delete(async function (req, res) {
      const bookid = req.params.id;
      try {
      const book = await Books.findById(bookid);

      if (!book) return res.json("no book exists");

      const deleted = await Books.findOneAndDelete(bookid);

      return res.json("delete successful");   
      } catch (error) {
        return res.json("no book exists")
      }
    });
};
