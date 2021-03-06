const Post = require("../models/post.model");
const User = require("../models/users.model");
// const isAdmin = require("../middleware/isAdmin");
// creation Post seulement text

exports.createPost = (req, res, next) => {
  // const postObject = JSON.parse(req.body.post);
  // delete postObject._id;
  const post = new Post({
    ...req.body,
    // imageUrl: `${req.protocol}://${req.get("host")}/images/${
    //   req.file.filename
    // }`,
  });
  // console.log("req.file.filename");
  // console.log(req.file.filename);
  // console.log("post");
  // console.log(post);
  //   spread operator excelent
  post
    // sauvegarde dans mongoDB
    .save()
    .then(() => {
      res
        .status(200)
        .json({ msg: "Un post doit pouvoir contenir du texte et une image" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//   charger les modifications dans la base de données
exports.updatePost = (req, res, next) => {
  //   plustard modifier l'image aussi
  Post.updateOne({ _id: req.params.id }, { commentary: req.body.commentary })
    .then(() => {
      //   console.log(req.body.commentary);
      res.status(200).json({ msg: "update" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// recuperer un Post specifique
exports.findSinglePost = (req, res, next) => {
  // original
  Post.findOne({ _id: req.params.id })
    .then((insidePromise) => {
      console.log(req.params);
      res.status(200).json({ msg: "read", insidePromise });
    })
    // .sort({ createdAt: -1 }) pour regler le fil du commentaire
    .catch((error) => {
      console.log("Allah beni affetsin");
      res.status(400).json({ error: error });
    });
};

// recuperer toutes les Post
exports.findPost = (req, res, next) => {
  Post.find()
    .then((getAllPost) => {
      //   console.log(getAllPost);
      res.status(200).json({ msg: "read", getAllPost });
    })
    .catch((error) => res.status(400).json({ error: error }));
};

// supprimer un post
// c'est pas ideale pour savoir user is admin
const jwt = require("jsonwebtoken");

exports.deletePost = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodedToken.userId;

  // user is admin
  User.findOne({ _id: userId }).then((a) => {
    console.log(a);
    if (a.isAdmin !== false) {
      Post.deleteOne({ _id: req.body.params }).thrn((a) => {
        console.log("you are a moderateur");
        return res.status(200).json({ a, msg: "poste suprimer par le admin" });
      });
    }
    // user is owner of this post
    else {
      Post.deleteOne({ _id: req.params.id }).then((a) => {
        console.log(a);
        res.status(200).json({ a, msg: "poste suprimer par le user" });
      });
    }
  });

  // original changer le findOne par deleteOne
  // jwt decode et puis voir si ces admin ou non
  // Post.findOne({ _id: req.params.id }).then(() => {
  //   console.log(req.params.id);
  //   res
  //     .status(200)
  //     .json({ msg: " votre post a été supprimer", _id: req.params.id });
  // });

  //   .catch(() => res.status(400).json({ error: error }));
};
