const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require("../models/User.model")
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Tracker = require("../models/trackers.model");
const { response } = require("express");
const { registerHelper } = require("hbs");


module.exports = router;


router.get('/user-profile', isLoggedIn, (req, res) => {
  res.render('./user-profile', { userInSession: req.session.currentUser });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

router.get('/private', isLoggedIn, (req, res) => {
  res.render('./private', { userInSession: req.session.currentUser });
});
router.get('/main', isLoggedIn, (req, res) => {
  res.render('./main', { userInSession: req.session.currentUser });
});


router.get("/my-trackers", isLoggedIn, (req, res, next) => {
 
  const arr = [];
  Tracker.find({ user: req.session.currentUser._id })
    .then((response) => {
     
      response.forEach(element => { debugger
        if (element.trackerData.length > 0) {
          console.log()
          let arrLen=element.trackerData.length-1;
          let r = { data: element.trackerData[arrLen], name: element.alias }
          arr.push(r)
        }
      })
    }

    ).then(() => {
      console.log(arr, "newaat")
      let geoArray = [];
      arr.forEach((element, index) => {
        let obj = {
          name: element.name,
          coord: element.data.coordlat + ", " + element.data.coordlng,
          ind: index+1,
          time: element.data.time,
          speed: element.data.speed
        }
        geoArray.push(obj)
      }
      )
      console.log("pass", geoArray)
      res.render("./private/my-trackers.hbs", { userInSession: req.session.currentUser, geoArray });

    })
});

router.get("/history", isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("trackers")   //{ userInSession: req.session.currentUser }
    .then((response) => {

      console.log(response)
      res.render("./private/history.hbs", {
        userInSession: req.session.currentUser,
        response: response

      });

    })

    .catch((e) => {
      next(e);
    })

    ;

})


router.post("/bd-save/", (req, res, next) => {
  console.log(req.body)
  debugger
  let dataString= req.body.data;
  dataString=dataString.replace(/[(,)]/g, "");
  let arrGeoString =dataString.split(" ");
  let trackData={coordlat:arrGeoString[0],coordlng:arrGeoString[1]}
  Tracker.findByIdAndUpdate(
    req.body.id,
    {
      $push: { trackerData: trackData } }, { new: true }

  )
    .then((updatedUser) => { console.log(updatedUser) })
   return res.json({ done: 1 });
})



//list tracker
router.get("/addtracker", isLoggedIn, (req, res, next) => {

  User.findById(req.session.currentUser._id)
    .populate("trackers")   //{ userInSession: req.session.currentUser }
    .then((response) => {


      console.log(response)
      res.render("./private/addtracker.hbs", {

        userInSession: req.session.currentUser,
        response: response
      });

    })

    .catch((e) => {
      next(e);
    });

})


//new tracker
router.post("/addtracker/create", (req, res, next) => {
  debugger
  console.log("llega")
  let userId = req.session.currentUser._id
  console.log(userId, "id myuser")
  Tracker.create({
    alias: req.body.alias,
    user: userId
  })


    .then((createdTracker) => {
      // console.log('body-tracker', req.body)
      User.findByIdAndUpdate(userId, { $push: { trackers: createdTracker._id } }, { new: true })
        .then((updatedUser) => res.redirect('/addtracker'))
        .catch(e => next(e));

    })
    .catch((e) => console.log(e))

})


//Delete tracker
router.post("/addtracker-delete/:id", (req, res, next) => {
  // console.log("Llego aquí desde formulario");
  // console.log(req.params);
  const { id } = req.params;
  const user = req.session.currentUser

  Tracker
    .findByIdAndRemove(id)
    .then(response => {
      // console.log("Eliminado correctamente")
      console.log('Tracker a eliminar', response)
      console.log(id)
      console.log('Console de User.id', user._id)
      User.findByIdAndUpdate(user._id, { $pull: { trackers: { $in: [response._id] } } })
        .then(usuarioActualizado => {
          console.log('USuaraio actualizado', usuarioActualizado)
          res.redirect("/addtracker")
        })

    })
    .catch(e => console.log(e))
});




//details button
router.post("/addtracker-details/:id", (req, res) => {

  const id = req.params.id;
  Tracker.findById(id)
    .then((tracker) => {

      console.log('esta es la respuesta de details',);
      res.render("./private/details-tracker.hbs", { userInSession: req.session.currentUser, tracker });
    })
    .catch((e) => console.log(e));

    return res.json({200:OK});
});

router.post("/addtracker-edit/:id", (req, res, next) => {
  console.log(req.body)
  debugger
  Tracker.findByIdAndUpdate(req.params.id ,req.body)
         .then((updatedUser) => res.redirect('/addtracker'))})
