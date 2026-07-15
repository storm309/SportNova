const crypto = require("crypto");

const users = [];
const performances = [];

const createId = () => crypto.randomUUID();

const createUserRecord = (userData) => {
  const user = {
    ...userData,
    _id: createId(),
    createdAt: new Date(),
  };
  users.push(user);
  return user;
};

const findUserByEmail = (email) => {
  const normalizedEmail = (email || "").toLowerCase();
  return users.find((user) => user.email === normalizedEmail) || null;
};

const findUserById = (id) => {
  return users.find((user) => user._id.toString() === id.toString()) || null;
};

const listUsers = (query = {}) => {
  let result = [...users];
  if (query.role) {
    result = result.filter((user) => user.role === query.role);
  }
  return result;
};

const updateUserRole = (id, role) => {
  const user = findUserById(id);
  if (!user) return null;
  user.role = role;
  return user;
};

const deleteUserById = (id) => {
  const index = users.findIndex((user) => user._id.toString() === id.toString());
  if (index === -1) return null;
  const [removedUser] = users.splice(index, 1);
  for (let i = performances.length - 1; i >= 0; i -= 1) {
    if (performances[i].userId?.toString() === id.toString()) {
      performances.splice(i, 1);
    }
  }
  return removedUser;
};

const createPerformanceRecord = (performanceData) => {
  const performance = {
    ...performanceData,
    _id: createId(),
    createdAt: new Date(),
  };
  performances.push(performance);
  return performance;
};

const listPerformancesByUser = (userId, { page = 1, limit = 10 } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 10);
  const filtered = performances.filter((performance) => performance.userId?.toString() === userId.toString());
  const total = filtered.length;
  const start = (safePage - 1) * safeLimit;
  const data = filtered.slice(start, start + safeLimit).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { data, total, page: safePage, limit: safeLimit };
};

const listPerformances = (query = {}, { page = 1, limit = 20 } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 20);
  let filtered = [...performances];
  if (query.sport) {
    filtered = filtered.filter((performance) => performance.sport === query.sport);
  }
  const total = filtered.length;
  const start = (safePage - 1) * safeLimit;
  const data = filtered.slice(start, start + safeLimit).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { data, total, page: safePage, limit: safeLimit };
};

const deletePerformanceById = (id) => {
  const index = performances.findIndex((performance) => performance._id.toString() === id.toString());
  if (index === -1) return null;
  const [removedPerformance] = performances.splice(index, 1);
  return removedPerformance;
};

module.exports = {
  createUserRecord,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUserRole,
  deleteUserById,
  createPerformanceRecord,
  listPerformancesByUser,
  listPerformances,
  deletePerformanceById,
};
