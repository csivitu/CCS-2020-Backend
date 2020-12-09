import { Document } from 'mongoose';
import express from 'express';
// TODO: success problem

export interface reqSchema extends express.Request {
  body: {
    domain: string;
    responses: Array<{
      questionNo: number;
    }>
  };
  participant: {
    username: string;
  };
}

export interface participant extends Document {
  username: string;
  time: {
    [key: string]: {
		timeEnded: Date,
		timeStarted: Date,
    };
  };
  responses: {
    [key: string]: Array<{questionNo: number}>;
  };
}

export interface jsonResponseSchema{
  success?: boolean,
  [key: string]: string | boolean,
}

export interface questions extends Document {

}
