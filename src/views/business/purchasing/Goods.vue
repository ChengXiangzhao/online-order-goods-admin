<template>
    <div class="purchasing-goods">
        <div class="search-area">
            <el-form :inline="true" :model="searchForm" label-suffix=":" label-position="right">
                <el-form-item label="订货会名称">
                    <el-select v-model="searchForm.id" @change="handleSelectChange">
                        <el-option
                            v-for="item in purchasings"
                            :key="item.value"
                            :value="item.value"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="款号">
                    <el-input v-model="searchForm.fashion" placeholder="请输入款号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-area standardTable">
            <div v-if="type === 'update'" class="table-actions">
                <el-button>批量撤出</el-button>
            </div>
            <Table
                :data-source="tableDatas"
                :columns="columns"
                :loading="loading"
                hasPagination
                @handleSize="handleSizeChange"
                @handleCurrent="handleCurrentChange"
                :total="totalCount"
                :current-page="currPage"
                :page-size="pageSize"
            ></Table>
        </div>
    </div>
</template>

<script>
import Table from '@components/Table';
import { colRender, arrayFind } from '@/utils/util';
import { queryPurchasingDict, querySelectedPurGoods } from '@/api/business';
import bitmap from '@/assets/images/bitmap.png'


export default {
    name: 'purchasing-goods',
    components: {
        Table
    },
    props: {
        type: {
            type: String,
            default: 'add'
        },
        id: {
            type: Number,
            required: false
        }
    },
    data() {
        let _self = this;
        return {
            searchForm: {
                id: '',
                fashion: ''
            },
            categoryList: [
                {
                    name: '全部',
                    value: 'all-search'
                }
            ],
            prodList: [
                {
                    name: '全部',
                    value: 'all-search'
                },
                {
                    name: '备货中',
                    value: ''
                },
                {
                    name: '未投产',
                    value: 'unprod'
                },
                {
                    name: '正常生产',
                    value: 'normal'
                },
                {
                    name: '停产',
                    value: 'stop'
                }
            ],
            prods: {
                unprod: '未投产',
                normal: '正常生产',
                stop: '停产'
            },
            merchantList: [],
            purchasings: [],
            selectedPur: {},
            tableDatas: [],
            loading: false,
            totalCount: 0,
            currPage: 1,
            pageSize: 50,
            columns: [
                {
                    type: 'selection',
                    width: 55
                },
                {
                    prop: 'id',
                    label: '',
                    minWidth: 100,
                    render: function (h, {record}) {
                        return h('img', {
                            attrs: {
                                src: record.thumbUrl ? record.thumbUrl : bitmap,
                                width: 60,
                                height: 60
                            },
                            style: 'margin: 6px 0;'
                        })
                    }
                },
                {
                    prop: 'name',
                    label: '标题',
                    minWidth: 160,
                    render: function (h, {record}) {
                        return h('ul', {}, [
                            h('li', {}, [h('el-button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => console.log(record)
                                }
                            }, record.name)]),
                            h('li', {}, [h('span', {
                                style: 'display: inline-block;'
                            }, `ID: ${record.id}`)])
                        ]);
                    }
                },
                {
                    prop: 'fashion',
                    label: '款号',
                    minWidth: 100
                },
                {
                    prop: 'price',
                    label: '价格',
                    minWidth: 100
                },
                {
                    prop: 'colorNum',
                    label: '颜色数',
                    minWidth: 100
                },
                {
                    prop: 'inventoryNum',
                    label: '库存',
                    minWidth: 100
                },
                {
                    prop: 'orderlist',
                    label: '展示顺序',
                    minWidth: 100
                },
                {
                    prop: 'stock',
                    label: '生产状态',
                    minWidth: 100,
                    render: function (h, {record}) {
                        return <span>{`${record.status_prod !== '' ? _self.prods[record.status_prod] : '备货中'}`}</span>;
                    }
                },
                {
                    prop: 'purname',
                    label: '订货会标题',
                    minWidth: 160
                },
                {
                    prop: 'action',
                    label: '操作',
                    width: 120,
                    render: colRender([
                        {
                            text: '撤出活动',
                            code: 'reback',
                            onClick: this.reback
                        }
                    ])
                }
            ]
        }
    },
    methods: {
        handleSizeChange (val) {
            this.pageSize = val;
            this.currPage = 1;
            this.query();
        },
        handleCurrentChange (val) {
            this.currPage = val;
            this.query();
        },
        query () {
            this.loading = true;
            let params = {
                page: this.currPage,
                pageSize: this.pageSize,
                purchasing_id: this.searchForm.id
            };
            if (this.searchForm.fashion !== '') {
                params.fashion = this.searchForm.fashion;
            }
            querySelectedPurGoods(params).then(({datas, status, message}) => {
                this.loading = false;
                let list = [];
                datas.infos.forEach(item => {
                    item.base.thumbUrl = item.relateData.websiteGoodsData.thumbUrl;
                    item.base.status_prod = item.relateData.websiteGoodsData.status_prod;
                    item.base.fashion = item.relateData.websiteGoodsData.fashion;
                    item.base.purname = this.selectedPur.name;
                    list.push(item.base);
                });
                this.tableDatas = list;
                this.totalCount = datas.pages.totalCount;
            }).catch(function(error) {
                console.log(error);
            });
        },
        getPurchasingDict () {
            queryPurchasingDict({point_format_list: 'cascade'}).then((res) => {
                this.purchasings = Object.keys(res.datas).map(item => {
                    return {
                        value: item,
                        name: res.datas[item]
                    };
                });
            });
        },
        handleSelectChange (val) {
            this.selectedPur = arrayFind(this.purchasings, 'value', val);
            this.query();
        },
        init(id) {
            this.searchForm.id  = id + '';
            this.query();
        }
    },
    watch: {
        id: function (){
            this.init(this.id);
        }
    },
    created () {
        this.getPurchasingDict();
        if (this.id) {
            this.init(this.id);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.purchasing-goods {
    padding-top: 20px;
    position: relative;
}
</style>
