import express from 'express';
const router = express.Router();

//since this is a request to / then push a standard webpage
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "Welcome to the EzDealsHub Marketplace" });
});

export default router;