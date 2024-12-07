import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userProducts: [{
    type: Types.ObjectId,
    ref: 'Product'
  }],
  savedProducts: [{
    type: Types.ObjectId,
    ref: 'Product'
  }],
  rooms: [{
    type: Types.ObjectId,
    ref: 'Room'
  }],
}, { timestamps: { createdAt: 'created_at' } });

userSchema.pre("save", async function () {

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  
});

const User = model("User", userSchema);

export default User;

// ✔️