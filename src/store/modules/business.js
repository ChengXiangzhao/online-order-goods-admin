const business = {
  state: {
    currScence: null,
    steps: ['基本信息', '评款设置', '管理评款商品']
  },
  mutations: {
    SET_SCENCE: (state, scene) => {
      state.currScence = scene;
    },
    SET_STEPS: (state, steps) => {
      state.steps = steps;
    }
  },
  actions: {}
}

export default business
