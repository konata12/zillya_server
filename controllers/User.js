import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Register user
export const Register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, surname, email, password } = req.body

    const isUsed = await User.findOne({email})

    if(isUsed){
      return res.json({
        message: "this email alredy used",
        status: 400
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const newUser = new User({
      name,
      surname,
      email,
      password:hash,
      Orders : [],
    })



    await newUser.save()

    res.json({
      newUser, status: 201
    })
  }
  catch (error) {
    console.log(error);
    res.json({message: `error while creating user${error}`, status: 400})
  }
}

// login user
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email });

    if(!user){
      return res.json({
        message: 'This user does not exist',
        status: 404,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect) {
      res.json({
        message:"incorrect password",
        status: 401 ,
      })
    }

    const token = jwt.sign({
      id: user._id,
      },process.env.JWT_SECRET,
      {expiresIn: '30d'},
    )

    if(!token) {
      res.json({message: 'something went wrong', status: 500})
    }

    res.json({
      token, user, message: 'You successfully entered the system', status: 201,
    })

  }
  catch (error) {
    res.json({message: 'something went wrong', status: 500})
  }
}

//get me
export const GetMe = async (req, res) => {
  function getIdFromUrl(url) {
    const parts = url.split('/');
    const idWithColon = parts[parts.length - 1];
    const id = idWithColon.replace(':', ''); // замінити ":" на порожній рядок
    return (id);
  }

  const reqId = getIdFromUrl(req.url)
  try {
    const user = await User.findById(reqId);

    if(!user){
      return res.json({
        message: 'this user is not exist'
      })
    }

    const token = jwt.sign({
      id: user._id,
      },process.env.JWT_SECRET,
      {expiresIn: '30d'},
    )

    res.json({
      user, token
    })

  }
  catch (error) {
    console.log(error);
    res.json({
      message: "no permision"
    })
    
  }
}

export const updateInfo = async (req, res) => {

  const data = req.body.userData;

  try {
    const user = await User.findById(data._id);

      if (user) {
        user._id = data._id,
        user.name = data.name,
        user.surname = data.surname,
        user.email = data.email,
        user.number = data.number,
        user.city = data.city,
        user.index = data.index,
        user.houseNum = data.houseNum,
        user.apartment = data.apartment,
        user.orders = user.orders
      };
        

    await user.save()

    res.json({user})
  }
  catch (error) {
    console.log(error);
    res.json({
      message: `no permision ${error}`
    })
    
  }
}