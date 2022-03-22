const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

    name: {
        type: 'string',
        required: true
    },

    email: {
        type: 'string',
        lowercase: true,
        unique: true,
        required: [true, "Can't be empty"],
        match:[/\S+@\S+\.\S/, "Is invalid"],
        index: true
    },

    password: {
        type: 'string',
        required: [true, "Can't be empty"]
    },

    tokens: [],

    blogs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BlogPost'
    }],
})

UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password'))
    return next();
    // if user being created, or updated
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err,hash){
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'ghjikldnf');
    //console.log(token);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.statics.findByCredentials = async function(email,password)  {
    const user = await User.findOne({email});
    if(!user) throw new Error('Invalid Email and Password');
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid Email and Password')
    return user
}

const User = mongoose.model('User', UserSchema);

module.exports = User;