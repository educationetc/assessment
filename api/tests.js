import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const Tests = new Mongo.Collection('tests');

// Meteor.subscribe('tests');