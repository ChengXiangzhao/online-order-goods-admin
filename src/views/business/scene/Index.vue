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
                <el-tab-pane name="sceneSetting">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-setting"></i> 活动设置</span>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="right-btns">
            <el-button type="primary" icon="el-icon-plus" @click="add">新建活动</el-button>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import Table from '@components/Table';
import { getList } from '@/api/business';
import { colRender } from '@/utils/util';

export default {
    name: 'scene-list',
    components: {
        Table
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
                    label: 'ID',
                    minWidth: 100
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
                status: this.searchForm.status
            };
            if (this.searchForm.name !== '') {
                params.name = this.searchForm.name;
            }
            getList(params).then(({datas, status, message}) => {
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
        edit () {
            console.log(this.activeName);
        },
        pause () {
            console.log(this.activeName);
        },
        setting () {
            console.log(this.activeName);
        },
        qrView () {
            console.log(this.activeName);
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
.scene-list {
    padding-top: 60px;
    position: relative;

    .right-btns {
        position: absolute;
        top: 60px;
        right: 20px;
    }

    .label-outside {
        width: 220px;
        height: 40px;
        border: 0;
        border-bottom: 1px solid #ddd;
        text-align: center;

        .label-inner {
            display: inline-block;
            width: 200px;
            height: 40px;
            border-radius: 5%;
            border-bottom-left-radius: 0%;
            border-bottom-right-radius: 0%;
            border: 1px solid #ddd;
            background-color: rgba(#eee, 0.4);
        }
    }

    .el-tabs--top.el-tabs--card .el-tabs__item:nth-child(2) {
        padding-left: 0;
    }
    .el-tabs--top.el-tabs--card .el-tabs__item:last-child {
        padding-right: 0;
    }

    .el-tabs__header {
        .el-tabs__nav {
            border: none;
        }

        .el-tabs__item {
            border: none;
            border-bottom: 1px solid #ccc;
            padding: 0;
        }

        .el-tabs__item.is-active {
            .label-inner {
                border-bottom: 1px solid #fff;
                background-color: #fff
            }
        }
    }

    .el-tabs__content {
        padding: 20px;
    }

    .cell {
        ul{
            list-style-type:none;
            width:100%;
            margin: 0;
            padding: 0;
        }

        .el-button--small {
            padding: 4px 1px;
        }
        .el-button+.el-button {
            margin-left: 0;
        }
    }
}
</style>
