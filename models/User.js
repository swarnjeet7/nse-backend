const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = mongoose.Schema({
  UserName: {
    type: String,
    required: true,
    index: { unique: true },
  },
  UserType: {
    type: String,
    required: true,
  },
  FullName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  ConfirmPassword: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("Password")) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.Password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.Password = hash;
      user.ConfirmPassword = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.Password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.normalizePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.Password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema, "Users");
