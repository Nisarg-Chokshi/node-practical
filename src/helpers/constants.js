module.exports = {
  USER_ROLES: {
    CLIENT: 'Client',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
  },
  TICKET_STATUS: {
    PENDING: 'Pending',
    APPROVED_BY_EMPLOYEE: 'EmployeeApproved',
    REJECTED_BY_MANAGER: 'ManagerRejected',
    APPROVED_BY_MANAGER: 'ManagerApproved',
    REJECTED_BY_ADMIN: 'AdminRejected',
    APPROVED_BY_ADMIN: 'AdminApproved',
    REJECTED_BY_CLIENT: 'ClientRejected',
    APPROVED_BY_CLIENT: 'ClientApproved',
    COMPLETED: 'Completed',
  },
  REMARK: {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  },
  MESSAGE: {
    PERMISSON_DENIED: 'Permisson denied!',
    INVALID_LOGIN: 'Login credentials are incorrect!',
    RESOURCE_EXISTS: 'Resource(s) already exists!',
    RESOURCE_NOT_FOUND: 'Resource(s) not found!',
    SOMETHING_WENT_WRONG: 'Something went wrong!',
    PASSWORD_UPDATED: 'Password updated successfully!',
    UNAUTHORIZED: 'User not authorized!',
  },
  SALT_ROUNDS: 10,
};
