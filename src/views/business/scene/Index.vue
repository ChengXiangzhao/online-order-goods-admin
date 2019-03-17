<template>
    <div class="scene-list">
        <div class="main">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane name="sceneList">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-tickets"></i> 活动列表</span>
                            </div>
                        </div>
                    </template>
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
                            <el-form-item label="活动名称">
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
                </el-tab-pane>
                <el-tab-pane name="sceneSetting" lazy>
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-setting"></i> 活动设置</span>
                            </div>
                        </div>
                    </template>
                    <Setting></Setting>
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
import { mapMutations } from 'vuex';
import Table from '@components/Table';
import Setting from './Setting';
import RestartDialog from '../RestartDialog';
import ShareDialog from '../ShareDialog';
import { listScene } from '@/api/business';
import { colRender } from '@/utils/util';
import bitmap from '@/assets/images/thumb_pic10.jpg'

export default {
    name: 'scene-list',
    components: {
        Table,
        Setting,
        RestartDialog,
        ShareDialog
    },
    data() {
        let _self = this;
        return {
            activeName: 'sceneList',
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
                }
            ],
            statusList: null,
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
                                    src: record.pictureUrl ? record.pictureUrl : bitmap,
                                    width: 70,
                                    height: 60
                                },
                                style: 'margin: 3px 0;'
                            })]),
                            h('li', {}, [h('div', {
                                style: 'text-align: center;color: #2776cd;'
                            }, record.code)])
                        ]);
                    }
                },
                {
                    prop: 'name',
                    label: '活动标题',
                    minWidth: 160
                },
                {
                    prop: 'title',
                    label: '副标题',
                    minWidth: 140
                },
                {
                    prop: 'sort',
                    label: '活动类型',
                    minWidth: 100,
                    render: function (h, {record}) {
                        let types = [];
                        if (record.sort === 'both') {
                            types = ['评款会', '定货会'];
                        } else if (record.sort === 'appraisal') {
                            types = ['评款会'];
                        } else {
                            types = ['定货会'];
                        }

                        return h('ul', {}, types.map(item => {
                            return h('li', {}, [h('el-button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => console.log(item)
                                }
                            }, item)]);
                        }));
                    }
                },
                {
                    prop: 'stadium',
                    label: '场馆名',
                    minWidth: 160
                },
                {
                    prop: 'address',
                    label: '地址',
                    minWidth: 200
                },
                {
                    prop: 'start_at',
                    label: '活动日期',
                    width: 100,
                    render: function (h, {record}) {
                        if (typeof record.start_at === 'number') {
                            return <span>{`${moment.unix(record.start_at).format('YYYY-MM-DD')} - ${moment.unix(record.end_at).format('YYYY-MM-DD')}`}</span>;
                        } else {
                            return <span>{`${record.start_at.substr(0, 11)} - ${record.end_at.substr(0, 11)}`}</span>;
                        }
                    }
                },
                {
                    prop: 'status',
                    label: '活动状态',
                    minWidth: 100,
                    render: function (h, {record}) {
                        return <span>{`${_self.statusList[record.status]}`}</span>;
                    }
                },
                {
                    prop: 'action',
                    label: '操作',
                    width: 220,
                    render: colRender([
                        {
                            text: '修改活动',
                            code: 'edit',
                            onClick: _self.edit
                        },
                        {
                            text: '暂停',
                            code: 'pause',
                            onClick: _self.pause,
                            hidden: (record) => record.status !== '99'
                        },
                        {
                            text: '重启',
                            code: 'pause',
                            onClick: _self.restart,
                            hidden: (record) => record.status !== '99'
                        },
                        {
                            text: '添加评款会',
                            code: 'edit',
                            onClick: _self.addAppraisal,
                            hidden: _self.hiddenAppraisal
                        },
                        {
                            text: '添加评款商品',
                            code: 'edit',
                            onClick: _self.addAg,
                            hidden: _self.hiddenAg
                        },
                        {
                            text: '添加订货会',
                            code: 'edit',
                            onClick: _self.addPurchasing,
                            hidden: _self.hiddenPurchasing
                        },
                        {
                            text: '添加订货商品',
                            code: 'edit',
                            onClick: _self.addPg,
                            hidden: _self.hiddenPg
                        },
                        {
                            text: '活动设置',
                            code: 'setting',
                            onClick: _self.setting
                        },
                        {
                            text: '查看二维码',
                            code: 'qrView',
                            onClick: _self.qrView
                        }
                    ])
                }
            ],
            restartVisible: false,
            shareVisible: false,
            scene: {}
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
                status: this.searchForm.status
            };
            if (this.searchForm.name !== '') {
                params.name = this.searchForm.name;
            }
            listScene(params).then(({datas, status, message}) => {
                this.loading = false;
                let list = [];
                datas.infos.forEach(item => {
                    list.push(item.base);
                });
                this.tableDatas = list;
                this.totalCount = datas.pages.totalCount;

                if (!this.statusList) {
                    this.statusList = datas.relateAttributes.status;
                }

                if (this.searchStatusList.length === 1) {
                    let rawd = datas.listSearchAttributes.status.infos;
                    let keys = Object.keys(rawd);
                    let ssl = [];
                    keys.forEach(key => {
                        ssl.push({
                            name: rawd[key],
                            value: key
                        })
                    });
                    this.searchStatusList = ssl;
                }
            }).catch(function(error) {
                console.log(error);
            });;
        },
        handleTabClick () {
            console.log(this.activeName);
        },
        edit (record) {
            this.$router.push({path: '/business/addScene', query: {id: record.id}});
        },
        pause () {
            this.restartVisible = true;
        },
        restart () {
            this.restartVisible = true;
        },
        setting () {
            console.log(this.activeName);
        },
        qrView (record) {
            this.scene = record;
            this.shareVisible = true;
        },
        add () {
            this.$router.push('/business/addScene');
        },
        hiddenAppraisal (scene) {
            return scene.appraisalId !== 0 || scene.sort === 'purchasing';
        },
        hiddenPurchasing (scene) {
            return scene.purchasingId !== 0 || scene.sort === 'appraisal';
        },
        addAppraisal (scene) {
            this.SET_SCENCE(scene);
            this.$router.push('/business/appraisal-setting?type=add');
        },
        addPurchasing (scene) {
            this.SET_SCENCE(scene);
            this.$router.push('/business/purchasing-setting?type=add');
        },
        hiddenAg (scene) {
            return scene.sort === 'purchasing';
        },
        hiddenPg (scene) {
            return scene.sort === 'appraisal';
        },
        addAg (scene) {
            this.SET_SCENCE(scene);
            this.$router.push('/business/appraisal-goods?type=addAg');
        },
        addPg (scene) {
            this.SET_SCENCE(scene);
            this.$router.push('/business/purchasing-goods?type=addPg');
        },
        ...mapMutations([
            'SET_SCENCE'
        ])
    },
    created () {
        this.query();
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene-list {
    padding-top: 60px;
    position: relative;

    .right-btns {
        position: absolute;
        top: 60px;
        right: 20px;
    }
}
</style>
