const { validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const {
  updateUser,
  getAllusers,
  deleteUser,
  findUser,
  findUserById,
  updatePassword,
  makeUserAdmin,
  changeAdminProperty,
} = require("../models/userActions");
const { User } = require("../models/User.model");
const { todayRecords } = require("../config/todayRecords");
const { sharpImage } = require("../middlewares/sharpConfig");
const { unlinkUncompressedFiles } = require("../middlewares/fileEditor");

module.exports.getLogin = (req, res) => {
  res.render("users/login", {
    title: "Login",
    active: "login",
    errors: [],
    num: 0,
  });
};

module.exports.getRegisteration = (req, res) => {
  res.render("users/register", {
    title: "Registeration",
    active: "register",
    errors: [],
    data: false,
    password: "",
    re_password: "",
    num: 0,
  });
};

module.exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("users/login", {
      errors: errors.array(),
      title: "Login",
      active: "login",
      num: 0,
    });
  } else {
    next();
  }
};

module.exports.postRegisteration = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("users/register", {
      title: "Registeration",
      active: "register",
      data: req.body,
      password: req.body.password,
      re_password: req.body.re_password,
      errors: errors.array(),
      num: 0,
    });
  } else {
    console.log(`Original image size : ${req.file.size}`);
    await sharpImage(req.file.path);
    await unlinkUncompressedFiles();
    req.file.filename = req.file.path.split("\\")[1].split(".")[0] + ".png";
    next();
  }
};

module.exports.getProfile = async (req, res) => {
  const todayrec = await todayRecords(req.user._id);
  res.render("users/profile", {
    title: "profile",
    active: "profile",
    num: todayrec,
  });
};
module.exports.getEditProfile = async (req, res) => {
  const todayrec = await todayRecords(req.user._id);
  res.render("users/editProfile", {
    active: "profile",
    title: "Edit Profile",
    user: req.user,
    errors: [],
    num: todayrec,
  });
};

module.exports.postEditProfile = async (req, res) => {
  const todayrec = await todayRecords(req.user._id);
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render("users/editProfile", {
      active: "profile",
      title: "Edit Profile",
      user: req.user,
      errors: errors.array(),
      num: todayrec,
    });

  let data;
  if (!req.file) {
    data = {
      name: req.body.userName,
      email: req.user.email,
      password: req.body.password,
      image: req.user.image,
      joinDate: req.user.joinDate,
    };
  } else {
    console.log(`Original image size : ${req.file.size}`);
    await sharpImage(req.file.path);
    await unlinkUncompressedFiles();
    req.file.filename = req.file.path.split("\\")[1].split(".")[0] + ".png";
    data = {
      name: req.body.userName,
      email: req.user.email,
      password: req.body.password,
      image: req.file.filename,
      joinDate: req.user.joinDate,
    };
  }

  const updatedUser = await updateUser(req.user.id, data);

  if (updatedUser == "wrong password") {
    res.render("users/editProfile", {
      active: "profile",
      title: "Edit Profile",
      user: req.user,
      errors: [
        {
          param: "password",
          msg: "wrong password",
        },
      ],
      num: todayrec,
    });
  } else {
    res.redirect("../profile");
  }
};

module.exports.logout = (req, res) => {
  req.logOut();
  res.redirect("login");
};

module.exports.getAllUsers = async (req, res) => {
  let UserpageNo = parseInt(req.params.pageNo);
  pageNo = UserpageNo - 1;
  // -1 himself
  const NORecords = (await User.countDocuments({ isSuperAdmin: false })) - 1;
  let query = {
    skip: pageNo * 5,
    limit: 5,
  };

  if (pageNo >= Math.ceil(NORecords / 5)) {
    pageNo = Math.ceil(NORecords / 5) - 1;
    UserpageNo = pageNo + 1;
    query.skip = pageNo * 5;
  }

  const users = await getAllusers(query, req.user.id);
  const todayrec = await todayRecords(req.user._id);
  res.render("users/allUsers", {
    active: "users",
    title: "App Users",
    users: users,
    pageNo: ++pageNo,
    NORecords: NORecords,
    mainUser: req.user,
    num: todayrec,
  });
};

module.exports.deleteUser = (req, res) => {
  const deletedUser = deleteUser(req.params.id);
  res.redirect("../allUsers");
};

module.exports.getChangePassword = async (req, res) => {
  const todayrec = await todayRecords(req.user._id);
  res.render("users/changePassword", {
    user: req.user,
    title: "Change Password",
    active: "profile",
    errors: [],
    num: todayrec,
  });
};

module.exports.postChangePassword = async (req, res, next) => {
  const todayrec = await todayRecords(req.user._id);
  const errResult = validationResult(req);
  if (!errResult.isEmpty()) {
    res.render(`users/changePassword`, {
      errors: errResult.array(),
      user: req.user,
      title: "Change Password",
      active: "profile",
      num: todayrec,
    });
  } else {
    const user = await findUserById(req.user.id);
    const passwordCMP = await user.validPassword(req.body.password, user);
    if (!passwordCMP) {
      res.render(`users/changePassword`, {
        errors: [
          {
            param: "password",
            msg: "You Entered Wrong Password",
          },
        ],
        user: req.user,
        title: "Change Password",
        active: "profile",
        num: todayrec,
      });
    } else {
      const newPassword = await User.hashPassword(req.body.newPassword);
      const result = await updatePassword(req.user.id, newPassword);
      if (result) {
        req.logOut();
        res.redirect("login");
      } else {
        res.render(`users/changePassword`, {
          errors: [
            {
              param: "confirmPassword",
              msg: "Something went wrong",
            },
          ],
          user: req.user,
          title: "Change Password",
          active: "profile",
          num: todayrec,
        });
      }
    }
  }
};

module.exports.makeAdmin = async (req, res) => {
  const isAdminUser = await changeAdminProperty(req.params.id, true);
  res.redirect("/users/allUsers");
};

module.exports.removeAdmin = async (req, res) => {
  const isAdminUser = await changeAdminProperty(req.params.id, false);
  res.redirect("/users/allUsers");
};
