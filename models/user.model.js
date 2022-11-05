const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
})

// The code in the UserScheme.pre() function is called a pre-hook.
// Before the user information is saved in the database, this function will be called,
// you will get the plain text password, hash it, and store it.
// UserSchema.pre(
//   'save',
//   async function (next) {
//       const user = this;
//       const hash = await bcrypt.hash(this.password, 10);

//       this.password = hash;
//       next();
//   }
// );

// // You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
// UserSchema.methods.isValidPassword = async function(password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);

//   return compare;
// }

  // encrypt password before saving document
UserSchema.pre('save', function (next) {
  let user = this

  // do nothing if the password is not modified
  if (!user.isModified('password')) return next()

  // hash the password using our new salt
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err)

    //override the clear text password with the hashed one
    user.password = hash
    next()
  })
})

// Compare user inputted password with password in the database
UserSchema.methods.isValidPassword = function (password) {
  // get password from the database
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    // compare the password coming from the user with the hash password in the database
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.password
  },
})

module.exports = mongoose.model('User', UserSchema)
