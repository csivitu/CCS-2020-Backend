import { Document } from 'mongoose';

export interface req {
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
}

export interface jsonResponseSchema{
	[key: string]: string;
	success?: boolean,
}
