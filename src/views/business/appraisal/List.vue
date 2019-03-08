<template>
    <div class="appraisal-list">
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
                <el-form-item label="评款会名称">
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
import { appraisalList } from '@/api/business';
import { colRender } from '@/utils/util';

export default {
    name: 'appraisal-list',
    components: {
        Table
    },
    data() {
        let _self = this;
        return {
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
                    label: 'ID',
                    minWidth: 100
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
                    label: '评款会标题',
                    minWidth: 140
                },
                {
                    prop: 'appraisal_range',
                    label: '评款日期',
                    width: 100,
                    render: function (h, {record}) {
                        return <span>{`${record.range[0][0].format('YYYY-MM-DD')} - ${record.range[record.range.length - 1][0].format('YYYY-MM-DD')}`}</span>;
                    }
                },
                {
                    prop: 'stadium',
                    label: '参会人员',
                    minWidth: 160
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
                            text: '评款设置',
                            code: 'setting',
                            onClick: _self.setting
                        },
                        {
                            text: '添加评款商品',
                            code: 'sales',
                            onClick: _self.setting
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
            appraisalList(params).then(({datas, status, message}) => {
                this.loading = false;
                let list = [];
                datas.infos.forEach(item => {
                    item.base.scene = item.relateData.sceneData;
                    // 2019/5/10 10:30-2019/5/10 18:00==2019/5/11 10:30-2019/5/11 12:00
                    let range = item.base.appraisal_range.split('==');
                    let rs = [];
                    range.forEach(item => {
                        let it = item.split('-');
                        rs.push([moment(it[0], 'YYYY/M/D HH:mm'), moment(it[1], 'YYYY/M/D HH:mm')])
                    });
                    item.base.range = rs;
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
            this.$router.push({path: '/business/addScene', query: {id: record.id}});
        },
        pause () {
            this.restartVisible = true;
        },
        setting (record) {
            this.$emit('action', {
                type: 'setting',
                data: record
            });
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
.appraisal-list {
    padding-top: 20px;
    position: relative;
}
</style>
