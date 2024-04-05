'use strict';

const { NotFoundRequestError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { findProduct } = require('./product.service');

/*
    key features: Comment Service
    + add comment [User, Shop]
    + get list comments [User, Shop]
    + delete comment [User, Shop, Admin]
*/

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundRequestError('Parent comment not found');
      }

      rightValue = parentComment.comment_right;

      // update many
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: {
            $gte: rightValue,
          },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: {
            $gt: rightValue,
          },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        'comment_right',
        {
          sort: {
            comment_right: -1,
          },
        }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId).lean();
      if (!parent) {
        throw new NotFoundRequestError('Not found comment for product');
      }

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  // delete
  static async deleteComment({ commentId, productId }) {
    // check the product exist in the database
    const foundProduct = await findProduct({
      product_id: productId,
    });
    if (!foundProduct) {
      throw new NotFoundRequestError('Product not found');
    }

    // xac dinh lef and right cua commentId
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundRequestError('Comment not found');
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // calc width = right - left + 1
    const width = rightValue - leftValue + 1;

    // delete all  child comments
    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: {
        $gte: leftValue,
        $lte: rightValue,
      },
    });

    // update left and right
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    return true;
  }
}

module.exports = CommentService;
