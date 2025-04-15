const Photo = require('../models/photo.model');
const Voter = require('./../models/Voter.model');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if(title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];
      if(fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif'){
        const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else res.status(400).json({ message: 'Invalid file!' });
    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
          message: 'Invalid params',
          errors: Object.values(err.errors).map(err => err.message)
      });
    }
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });
    else {
      const voter = await Voter.findOne({ user: req.clientIp});
      if(!voter) {
        const newVoter = new Voter({ user: req.clientIp, votes: photoToUpdate._id });
        await newVoter.save();
        photoToUpdate.votes++;
        photoToUpdate.save();
        res.send({ message: 'OK', user: req.clientIp });
      } else {
        const likedPhoto = voter.votes.includes(req.params.id);
        if(!likedPhoto){
          await voter.votes.push(req.params.id);
          await voter.save();
          photoToUpdate.votes++;
          photoToUpdate.save();
          res.send({ message: 'OK' });
        } else res.status(409).send({ message: 'You can not vote for this photo again!'});
      }    
    }
  } catch(err) {
    res.status(500).json(err);
  }
};
