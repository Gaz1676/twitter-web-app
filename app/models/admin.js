/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const mongoose = require('mongoose');

// Module to represent a Schema for an Admin model

const adminSchema = mongoose.Schema({
  email: String,
  password: String,
});



const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
