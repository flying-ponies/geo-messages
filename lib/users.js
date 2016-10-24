class User extends require('./modelbase') {
  // TODO validates(), save(), constructor()

  validates() {
    return false;
  }

  save(callback) {
    fields = {};
    fields.username = this.fields.username;
    fields.email = this.fields.email;

    // TODO bcrypt!
    fields.password_digest = this.fields.password;
  }
}

User.table = 'users';

module.exports = User;

// Driver code!

// User.all()
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// User.find(1)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// User.findBy({username: 'alex'})
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));

// let newUser = new User({
//   username: '',
//   email: '',
//   password: '',
//   passwordConfirmation: '',
// });
