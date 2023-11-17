class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::sign-up::`, req.body);
      return res.status(201).json({
        code: '201',
        metadata: {
          userId: `new`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
