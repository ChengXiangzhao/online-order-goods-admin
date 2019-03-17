
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
  },
  purchasingList: (config) => {
    return {
      status: 200,
      message: 'OK',
      datas: {
        infos: [{
          base: {
            id: 2,
            scene_id: 6,
            name: '衣点达新款大型低价订货会（测试）',
            purchasing_range: '2019/5/10 10:30-2019/5/10 18:00==2019/5/11 10:30-2019/5/11 12:00',
            min_money: 100,
            min_number: 29,
            min_number_goods: 5,
            created_at: 1548064775,
            updated_at: 1548064775,
            description: '<p>定会规则</p>',
            is_oversold: 2,
            status: '1',
          },
          relateData: {
            sceneData: {
              id: 6,
              name: '衣点达测试供货商',
              start_at: 1548064775,
              end_at: 1548064775,
              stadium: '鸟巢',
              thumbUrl: 'http://www.beeboone.com/images/prettyPhotoImages/thumb_pic10.jpg'
            }
          }
        }],
        relateAttributes: {
          is_oversold: {
            "0": "不允许超卖",
            "2": "允许超卖"
          }
        },
        listSearchAttributes: {
          is_oversold: {
            value: "no",
            type: "checkbox",
            name: "无限超卖",
            infos: {
              "all-search": "全部",
              "0": "不允许超卖",
              "2": "允许超卖"
            }
          },
          id: {
            name: "ID",
            type: "text",
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
  }
}
