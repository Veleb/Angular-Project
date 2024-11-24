import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

userSchema.pre("save", async function () {

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  
});

const User = mongoose.model("User", userSchema);

export default User;

// ✔️