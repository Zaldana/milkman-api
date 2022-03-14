const verifyUserIsLoggedIn = (req) => {

    if (!req.user) {

        throw new Error('User is not logged in');
    }

    return;
};

const verifyAdminPermission = (req) => {

    verifyUserIsLoggedIn(req);

    if (!req.user.isAdmin) {

        throw new Error('User is not an admin')
    }

    return;
};

const PermissionService = {
    verifyUserIsLoggedIn,
    verifyAdminPermission,
};

module.exports = PermissionService;