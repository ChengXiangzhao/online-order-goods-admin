<template>
    <div class="scene-goods">
        <div class="steps">
            <el-steps :active="2" finish-status="success" style="margin-top: 20px" v-if="$route.query.type === 'scene_add'">
                <el-step v-for="step in steps" :title="step" :key="step"></el-step>
            </el-steps>
        </div>
        <div class="main">
            <div class="search-area">
                <el-form :inline="true" :model="searchForm" label-suffix=":" label-position="right">
                    <!-- <el-form-item label="商品分类">
                        <el-select v-model="searchForm.category_code">
                            <el-option
                                v-for="item in categoryList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="生产状态">
                        <el-select v-model="searchForm.status_prod">
                            <el-option
                                v-for="item in prodList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="款号">
                        <el-input v-model="searchForm.fashion" placeholder="请输入款号"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="searchForm.created_at_start"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item label="店铺" placeholder="请选择">
                        <el-select v-model="searchForm.merchant_id">
                            <el-option
                                v-for="item in merchantList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="标题">
                        <el-input v-model="searchForm.name" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间">
                        <el-date-picker
                            v-model="searchForm.update_at_start"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table-area standardTable">
                <Table
                    :data-source="tableDatas"
                    :columns="columns"
                    :loading="loading"
                    hasPagination
                    @handleSize="handleSizeChange"
                    @handleCurrent="handleCurrentChange"
                    @selectionChange="handleSelectionChange"
                    :total="totalCount"
                    :current-page="currPage"
                    :page-size="pageSize"
                ></Table>
            </div>
            <div class="split-line"></div>
            <div class="btn-group">
                <el-button @click="cancel">取消</el-button>
                <el-button v-if="steps.length > 2 && $route.query.type === 'scene_add'" @click="next">保存并进行下一步</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Table from '@components/Table';
import { obj2FormData } from '@/utils/util';
import { queryAppGoods, addAppGoods } from '@/api/business';

export default {
    name: 'scene-appraisal-goods',
    components: {
        Table
    },
    data() {
        let _self = this;
        return {
            searchForm: {
                // category_code: 'all-search',
                status_prod: 'all-search',
                fashion: '',
                created_at: [],
                // merchant_id: '',
                name: '',
                update_at: []
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
            appraisals: [],
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
                    prop: 'price_origin',
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
                    prop: 'stock',
                    label: '生产状态',
                    minWidth: 100,
                    render: function (h, {record}) {
                        return <span>{`${record.status_prod !== '' ? _self.prods[record.status_prod] : '备货中'}`}</span>;
                    }
                }
            ],
            selections: []
        }
    },
    computed: {
        ...mapState({
            steps: state => state.business.steps,
            scene: state => state.business.currScence
        })
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
                status_prod: this.searchForm.status_prod,
                scene_id: this.scene.id
            };
            if (this.searchForm.name !== '') {
                params.name = this.searchForm.name;
            }
            if (this.searchForm.fashion !== '') {
                params.fashion = this.searchForm.fashion;
            }
            if (this.searchForm.created_at.length > 0) {
                params.created_at_start = moment(params.created_at[0]).format('YYYY-MM-DD HH:mm:ss');
                params.created_at_end = moment(params.created_at[1]).format('YYYY-MM-DD HH:mm:ss');
            }
            if (this.searchForm.update_at.length > 0) {
                params.update_at_start = moment(params.update_at[0]).format('YYYY-MM-DD HH:mm:ss');
                params.update_at_end = moment(params.update_at[1]).format('YYYY-MM-DD HH:mm:ss');
            }
            
            queryAppGoods(params).then(({datas, status, message}) => {
                this.loading = false;
                let list = [];
                datas.infos.forEach(item => {
                    list.push(item.base);
                });
                this.tableDatas = list;
                this.totalCount = datas.pages.totalCount;
            }).catch(function(error) {
                console.log(error);
            });
        },
        handleSelectionChange (selection) {
            this.selections = selection;
        },
        saveSelection() {
            return new Promise((resolve, reject) => {
                if (this.selections.length > 0) {
                    addAppGoods(obj2FormData({selections: this.selections.map(item => item.id)}), this.scene.id).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success'
                        });
                        resolve();
                    });
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请先勾选商品'
                    });
                    reject();
                }
            });
        },
        cancel() {
            this.$router.back();
        },
        confirm() {
            this.saveSelection().then(() => {
                this.cancel();
            });
        },
        next () {
            this.saveSelection().then(() => {
                this.$router.push('/business/purchasing-setting?type=scene-add');
            });
        }
    },
    created () {
        this.query();
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene-goods {
    padding: 20px;

    .steps {
        padding: 0 80px;
    }

    .main {
        padding-top: 40px;
    }

    .split-line {
        height: 0;
        margin: 10px;
        border-bottom: 1px solid rgba(#ccc, 0.6);
    }

    .btn-group {
        float: right;
        padding-right: 40px;
    }
}
</style>