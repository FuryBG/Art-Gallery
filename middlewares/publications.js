const publicationService = require("../services/publication");


module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            create: publicationService.create,
            edit: publicationService.edit,
            del: publicationService.del,
            getById: publicationService.findById,
            getAll: publicationService.getAll,
            subscribe: publicationService.subscribe
        }
        next();
    };
}