import { Document } from 'mongoose';
// TODO: success problem

export interface reqSchema {
  body: {
    domain: string;
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
  [key: string]: string,
}

export interface questions extends Document {

}
