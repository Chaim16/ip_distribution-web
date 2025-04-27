import { ACCESS_ENUM } from "./constant";

interface LoginUser {
  username: string;
  role: string;
}

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return Boolean 有无权限
 */
const checkAccess = (loginUser: LoginUser, needAccess?: unknown) => {
  if (needAccess === ACCESS_ENUM.UNKNOWN) {
    return true;
  }

  // 获取当前用户具有的权限
  const loginUserAccess = loginUser?.role ?? ACCESS_ENUM.UNKNOWN;
  if (needAccess === ACCESS_ENUM.GENERAL) {
    // 如果没登陆，则无权限
    if (loginUserAccess === ACCESS_ENUM.UNKNOWN) {
      return false;
    }
  }

  if (needAccess === ACCESS_ENUM.DESIGNER) {
    if (loginUserAccess === ACCESS_ENUM.UNKNOWN) {
      return false;
    }
    if (loginUserAccess === ACCESS_ENUM.GENERAL) {
      return false;
    }
  }

  if (needAccess === ACCESS_ENUM.ADMINISTRATOR) {
    if (loginUserAccess !== ACCESS_ENUM.ADMINISTRATOR) {
      return false;
    }
  }

  return true;
};

export default checkAccess;
