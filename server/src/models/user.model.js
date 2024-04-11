import mongoose from 'mongoose';
import crypto from 'crypto';

//create schema for users collection
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username is required.",
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: "Name is required.",
    },
    email: {
      type: String,
      trim: true,
      unique: "Email already exists",
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      required: "Email is required",
    },
    hashed_password: String,
    salt: String,
    avatar: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  },
  { collection: "users", timestamps: true } //use timestamps so createdAt is immutable
);
/* methods to generate hash of user entered password, updated security based on Node.JS
 * crypto API documentation regarding recommendations of NIST SP 800-131A, instead of
 * using HMAC and SHA-1 as shown in class example.
 */
UserSchema.methods = {
  generateSalt: function () {
    // generate 256bits of cryptographically strong pseudorandom data to use as salt
    return crypto.randomBytes(32).toString("hex");
  },
  encryptPassword: function (password, salt) {
    // hash the password with salt
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  },
  validatePassword: function (password) {
    // hash entered password with stored salt value
    let temp_hash = this.encryptPassword(password, this.salt);
    // safely compare (mitigate timing attack) stored hash with hash of password attempt
    // convert hash hex strings to buffer object since crypto.timingSafeEqual function cannot work with string objects
    return crypto.timingSafeEqual(Buffer.from(this.hashed_password, "hex"), Buffer.from(temp_hash, "hex"));
  },
};

const User = mongoose.model("User", UserSchema);

export default User;
