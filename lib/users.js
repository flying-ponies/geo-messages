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

// User.all(rows => console.log(rows));
//
// User.find(1, rows => console.log(rows));
//
// User.find_by({username: 'alex'}, rows => console.log(rows));

// let newUser = new User({
//   username: '',
//   email: '',
//   password: '',
//   passwordConfirmation: '',
// });
