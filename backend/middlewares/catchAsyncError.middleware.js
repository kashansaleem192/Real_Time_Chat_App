 const catchAsyncErrors = (func) =>  {
    return (req, res, next) => { 
        Promise.resolve(func(req, res, next)).catch(next);
}
}
export default catchAsyncErrors;