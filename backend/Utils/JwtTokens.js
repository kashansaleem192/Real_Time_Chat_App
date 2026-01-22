import jwt from "jsonwebtoken";

export const generateToken = (user, message, statuscode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  return res
    .status(statuscode)
    .cookie("token", token, {
      maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,   
      message,
      user: {         
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
      },
    });
};
