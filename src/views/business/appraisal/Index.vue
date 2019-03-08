<template>
    <div class="appraisal">
        <div class="main">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane name="list">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-tickets"></i> 评款会列表</span>
                            </div>
                        </div>
                    </template>
                    <List @action="handleAction"></List>
                </el-tab-pane>
                <el-tab-pane name="sals" lazy>
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-goods"></i> 评款会活动商品</span>
                            </div>
                        </div>
                    </template>
                    
                </el-tab-pane>
                <el-tab-pane name="setting" v-if="settingShow">
                    <template slot="label">
                        <div class="label-outside">
                            <div class="label-inner">
                                <span><i class="el-icon-setting"></i> 评款设置</span>
                            </div>
                        </div>
                    </template>
                    <Setting :appraisal="currentRecord" @close="handleSettingSwidth"></Setting>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="right-btns">
            <el-button type="primary" icon="el-icon-plus" @click="add">新建活动</el-button>
        </div>
    </div>
</template>

<script>
import List from './List';
import Setting from './Setting';

export default {
    name: 'appraisal-index',
    components: {
        List,
        Setting
    },
    data() {
        return {
            activeName: 'list',
            settingShow: false,
            currentRecord: null
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
                this.activeName = 'sals';
            } else {
                this.settingShow = true;
                this.activeName = 'setting';
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.appraisal {
    padding-top: 60px;
    position: relative;

    .right-btns {
        position: absolute;
        top: 60px;
        right: 20px;
    }
}
</style>
