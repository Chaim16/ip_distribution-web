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
  userList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/user_list/",
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
  workstationList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/workstation/workstation_list/",
      {
        params,
      }
    );
    return res.data;
  },
  workstationDetail: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/workstation/workstation_detail/",
      {
        params,
      }
    );
    return res.data;
  },
  createWorkstation: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/workstation/add/",
      body
    );
    return res.data;
  },
  modifyWorkstation: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/workstation/modify/",
      body
    );
    return res.data;
  },
  deleteWorkstation: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/workstation/del_workstation/",
      body
    );
    return res.data;
  },
  distribute: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/workstation/distribute/",
      body
    );
    return res.data;
  },
  switchList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/switch/switch_list/",
      {
        params,
      }
    );
    return res.data;
  },
  createSwitch: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/switch/add/",
      body
    );
    return res.data;
  },
  deleteSwitch: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/switch/del_switch/",
      body
    );
    return res.data;
  },
  modifySwitch: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/switch/modify/",
      body
    );
    return res.data;
  },
  switchPortList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/switch_port/switch_port_list/",
      {
        params,
      }
    );
    return res.data;
  },
  switchDetail: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/switch/switch_detail/",
      {
        params,
      }
    );
    return res.data;
  },
  routerPortList: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/router_port/router_port_list/",
      {
        params,
      }
    );
    return res.data;
  },
  routerPortDetail: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/router_port/router_port_detail/",
      {
        params,
      }
    );
    return res.data;
  },
  modifyRouterPort: async (body: object) => {
    const res = await axiosInstance.post(
      "/distribution/api/v1/router_port/modify/",
      body
    );
    return res.data;
  },
  getIPAddress: async (params: object) => {
    const res = await axiosInstance.get(
      "/distribution/api/v1/user/ip_address/",
      {
        params,
      }
    );
    return res.data;
  },
};

export default api;
