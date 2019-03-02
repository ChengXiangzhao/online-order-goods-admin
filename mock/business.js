
const scenes = [{
  "base": {
    "id": 6,
    "sort": "both",
    "code": "tsupplier",
    "supplier_id": 547,
    "website_id": 4,
    "name": "衣点达测试供货商",
    "title": "衣点达测试供货商",
    "stadium": "高碑店体验店",
    "address": "高碑店",
    "start_at": 1556640000,
    "end_at": 1556985600,
    "orderlist": 0,
    "is_signup": 0,
    "signup_start": 1548086400,
    "signup_end": 1556640000,
    "signup_sort": "employee",
    "signup_person": "",
    "created_at": 1548064528,
    "updated_at": 1548498322,
    "description": "",
    "status": "1"
  },
  "relateData": []
}];

export default {
  scenesList: (config) => {
    console.log(config);
    return {
      status: 200,
      message: 'OK',
      datas: {
        infos: scenes,
        relateAttributes: {
          status: {
            "0": "预备中",
            "1": "进行中",
            "99": "已完成"
          }
        },
        listSearchAttributes: {
          status: {
            value: "no",
            type: "checkbox",
            name: "状态",
            infos: {
              "all-search": "全部",
              "0": "预备中",
              "1": "进行中",
              "99": "已完成"
            }
          },
          created_at_start: {
            name: "日期时间",
            type: "daytime",
            format: "YYYYMMDD HH:mm:ss",
            end: {
              field: "created_at_end",
              type: "daytime",
              format: "YYYYMMDD HH:mm:ss"
            },
            value: "no"
          }
        },
        pages: {
          totalCount: 1,
          pageSize: 50,
          page: 1
        }
      }
    }
  },
  scenesAdd: (config) => {
    let sence = {};
    for (let ent of config.body.entries()) {
      sence[ent[0]] = ent[1];
    }
    sence.status = '1';
    scenes.push({
      base: sence,
      relateData: []
    });

    return {
      status: 200,
      message: '操作完成'
    };
  }
}
