import axiosInstance from "@/utils/axios";

const api = {
  userRegister: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/register/",
      body
    );
    return res.data;
  },
  userLogin: async (body: object) => {
    const res = await axiosInstance.post("/api/token/", body);
    return res.data;
  },
  whoami: async () => {
    const res = await axiosInstance.get("/distribution/api/v1/user/whoami/");
    return res.data;
  },
  userDetail: async () => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/user_detail/",
      {}
    );
    return res.data;
  },
  userModify: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/modify/",
      body
    );
    return res.data;
  },
  designerApplicationRecord: async () => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/designer_application_record/"
    );
    return res.data;
  },
  applyAsDesigner: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/apply_as_designer/",
      body
    );
    return res.data;
  },
  walletRecharge: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/recharge/",
      body
    );
    return res.data;
  },
  applyDesignerList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/apply_designer_list/",
      { params }
    );
    return res.data;
  },
  approveDesignerApplication: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/approve_designer_application/",
      body
    );
    return res.data;
  },
  userList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/user_list/",
      {
        params,
      }
    );
    return res.data;
  },
  publishDraft: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/draft/publish/",
      body
    );
    return res.data;
  },
  draftList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/draft/draft_list/",
      {
        params,
      }
    );
    return res.data;
  },
  createRouter: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/router/add/",
      body
    );
    return res.data;
  },
  routerList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/router/router_list/",
      {
        params,
      }
    );
    return res.data;
  },
  routerDetail: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/router/router_detail/",
      {
        params,
      }
    );
    return res.data;
  },
  deleteUser: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/user/del_user/",
      body
    );
    return res.data;
  },
  deleteRouter: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/router/del_router/",
      body
    );
    return res.data;
  },
  modifyRouter: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/router/modify/",
      body
    );
    return res.data;
  },
};

export default api;
