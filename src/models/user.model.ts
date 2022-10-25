import validator from 'validator';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    validate: validator.isEmail,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  quizzes: [
    {
      _id: {
        type: String,
        default: () => nanoid(),
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      creatorName: {
        type: String,
        required: true,
      },
      createdAt: Date,
      category: String,
      questions: [
        {
          question: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 140,
          },
          answer: {
            type: String,
            required: true,
            maxlength: 40,
          },
          fakeAnswer1: {
            type: String,
            required: true,
            maxlength: 40,
          },
          fakeAnswer2: {
            type: String,
            required: true,
            maxlength: 40,
          },
          fakeAnswer3: {
            type: String,
            required: true,
            maxlength: 40,
          },
        },
      ],
    },
  ]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.correctPassword = async function (loginPwd: string, hashPwd: string) {
  const comparingPassword = await bcrypt.compare(loginPwd, hashPwd);
  return comparingPassword;
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

export const user = model('User', userSchema);