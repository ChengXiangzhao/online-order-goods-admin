<template>
    <div class="purchasing">
        <div class="main">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane name="list">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-tickets"></i> 订货会列表</span>
                            </div>
                        </div>
                    </template>
                    <div class="purchasing-list">
                        <div class="search-area">
                            <el-form :inline="true" :model="searchForm">
                                <el-form-item label="活动状态">
                                    <el-select v-model="searchForm.status" multiple placeholder="请选择">
                                        <el-option
                                            v-for="item in searchStatusList"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.name"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="订货会名称">
                                    <el-input v-model="searchForm.name" placeholder="请输入名称(搜索标题)"></el-input>
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
                                :total="totalCount"
                                :current-page="currPage"
                                :page-size="pageSize"
                            ></Table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="goods">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-goods"></i> 订货会活动商品</span>
                            </div>
                        </div>
                    </template>
                    <Goods key="purchasing-goods" :id="currentRecord.id" type="update"></Goods>
                </el-tab-pane>
                <el-tab-pane name="setting" v-if="settingShow">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-setting"></i> 订货设置</span>
                            </div>
                        </div>
                    </template>
                    <Setting key="purchasing-setting" :purchasing="currentRecord"></Setting>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="right-btns">
            <el-button type="primary" icon="el-icon-plus" @click="add">新建活动</el-button>
        </div>

        <restart-dialog
            :visible="restartVisible"
            :is-overdue="true"
            :sceneId="1"
            @close="restartVisible = false"
        ></restart-dialog>

        <share-dialog
            :visible="shareVisible"
            :scene="scene"
            @close="shareVisible = false"
        ></share-dialog>
    </div>
</template>

<script>
import moment from 'moment';
import Table from '@components/Table';
import RestartDialog from '../RestartDialog';
import ShareDialog from '../ShareDialog';
import { purchasingList } from '@/api/business';
import { colRender } from '@/utils/util';
import bitmap from '@/assets/images/thumb_pic10.jpg'
import Setting from './Setting';
import Goods from './Goods';

export default {
    name: 'purchasing-index',
    components: {
        Table,
        Setting,
        Goods
    },
    data() {
        let _self = this;
        return {
            activeName: 'list',
            settingShow: false,
            currentRecord: {scene: {id: null}},
            tableDatas: [],
            totalCount: 1,
            pageSize: 50,
            currPage: 1,
            loading: false,
            searchForm: {
                status: 'all-search',
                name: ''
            },
            searchStatusList: [
                {
                    name: '全部',
                    value: 'all-search'
                },
                {
                    name: '预备中',
                    value: '0'
                },
                {
                    name: '进行中',
                    value: '1'
                },
                {
                    name: '已完成',
                    value: '99'
                }
            ],
            statusList: {
                "0": "预备中",
                "1": "进行中",
                "99": "已完成"
            },
            startCreatedTime: '',
            columns: [
                {
                    prop: 'id',
                    label: '',
                    width: 80,
                    render: function (h, {record}) {
                        return h('ul', {}, [
                            h('li', {}, [h('img', {
                                attrs: {
                                    src: record.scene.pictureUrl ? record.scene.pictureUrl : bitmap,
                                    width: 70,
                                    height: 60
                                },
                                style: 'margin: 3px 0;'
                            })]),
                            h('li', {}, [h('div', {
                                style: 'text-align: center;'
                            }, `ID: ${record.scene.id}`)])
                        ]);
                    }
                },
                {
                    prop: 'scene_name',
                    label: '活动标题',
                    minWidth: 160,
                    render: function (h, {record}) {
                        return h('el-button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => console.log(record.scene)
                            }
                        }, record.scene.name);
                    }
                },
                {
                    prop: 'scene_time',
                    label: '活动日期',
                    width: 100,
                    render: function (h, {record}) {
                        let scene = record.scene;
                        if (typeof scene.start_at === 'number') {
                            return <span>{`${moment.unix(scene.start_at).format('YYYY-MM-DD')} - ${moment.unix(scene.end_at).format('YYYY-MM-DD')}`}</span>;
                        } else {
                            return <span>{`${scene.start_at.substr(0, 11)} - ${scene.end_at.substr(0, 11)}`}</span>;
                        }
                    }
                },
                {
                    prop: 'name',
                    label: '订货会标题',
                    minWidth: 140
                },
                {
                    prop: 'purchasing_range',
                    label: '订货日期',
                    width: 145
                },
                {
                    prop: 'stadium',
                    label: '场馆名',
                    minWidth: 160,
                    render: function (h, {record}) {
                        return <span>{`${record.scene.stadium}`}</span>;
                    }
                },
                {
                    prop: 'status',
                    label: '活动状态',
                    minWidth: 100,
                    render: function (h, {record}) {
                        return <span>{`${_self.statusList[record.scene.status]}`}</span>;
                    }
                },
                {
                    prop: 'action',
                    label: '操作',
                    width: 120,
                    render: colRender([
                        {
                            text: '修改活动',
                            code: 'edit',
                            onClick: _self.edit
                        },
                        {
                            text: '暂停',
                            code: 'pause',
                            onClick: _self.pause
                        },
                        {
                            text: '订货设置',
                            code: 'setting',
                            onClick: _self.setting
                        },
                        {
                            text: '订货商品',
                            code: 'sales',
                            onClick: _self.goods
                        },
                        {
                            text: '添加订货商品',
                            code: 'sales',
                            onClick: _self.addGoods
                        },
                        {
                            text: '查看活动二维码',
                            code: 'qrView',
                            onClick: _self.qrView
                        }
                    ])
                }
            ],
            restartVisible: false,
            shareVisible: false
        }
    },
    methods: {
        handleTabClick () {
            console.log(this.activeName);
        },
        handleSettingSwidth (isSetting) {
            this.settingShow = isSetting;
            if (isSetting) {
                this.activeName = 'setting';
            } else {
                this.activeName = 'list';
            }
        },
        handleAction (action) {
            this.currentRecord = action.data;
            if (action.type === 'sale') {
                this.activeName = 'goods';
            } else {
                this.settingShow = true;
                this.activeName = 'setting';
            }
        },
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
                status: this.searchForm.status
            };
            if (this.searchForm.name !== '') {
                params.name = this.searchForm.name;
            }
            purchasingList(params).then(({datas, status, message}) => {
                this.loading = false;
                let list = [];
                datas.infos.forEach(item => {
                    item.base.scene = item.relateData.sceneData;
                    // 2019-03-26 09:00==2019-03-29 17:00
                    // let range = item.base.appraisal_range.split('==');
                    // item.base.range = [moment(range[0], 'YYYY/M/D HH:mm'), moment(range[1], 'YYYY/M/D HH:mm')];
                    list.push(item.base);
                });
                this.tableDatas = list;
                this.totalCount = datas.pages.totalCount;
            }).catch(function(error) {
                console.log(error);
            });;
        },
        handleTabClick () {
            console.log(this.activeName);
        },
        edit (record) {
            this.$router.push({path: '/business/addScene', query: {id: record.scene.id}});
        },
        pause () {
            this.restartVisible = true;
        },
        addGoods () {
            this.$router.push('/business/purchasing-goods')
        },
        goods (record) {
            this.currentRecord = record;
            this.activeName = 'goods';
        },
        setting (record) {
            this.settingShow = true;
            this.activeName = 'setting';
        },
        qrView () {
            this.shareVisible = true;
        },
        add () {
            this.$router.push('/business/addScene');
        }
    },
    created () {
        this.query();
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.purchasing {
    padding-top: 60px;
    position: relative;

    .right-btns {
        position: absolute;
        top: 60px;
        right: 20px;
    }
}
</style>
