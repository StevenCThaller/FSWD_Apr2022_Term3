const errorHandler = (error, req, res, next) => {
  let errorsObj = {}
  if (error.name === "ValidationError") {
    for (let key of Object.keys(error.errors)) {
      errorsObj[key] = error.errors[key].properties.message
    }

    return res.status(422).json(errorsObj)
  }

  res.status(500).json({ message: "Server Error" })
}

export default errorHandler;