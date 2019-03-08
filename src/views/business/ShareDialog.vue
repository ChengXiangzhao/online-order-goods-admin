<template>
    <el-dialog
        key="share"
        class="share-dialog"
        title="分享明细"
        :visible="visible"
        @close="handleCancel"
        width="40%"
    >
        <div class="share">
            <div class="detail-title">
                <div class="title-img">
                    <img src="../../assets/images/bitmap.png" width="120" height="120">
                </div>
                <el-form label-width="150px">
                    <el-form-item label="">
                        <el-input class="info-item" v-model="scene.name"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input type="textarea" :rows="3" class="info-item" v-model="scene.title"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人(电话)：">
                        <el-input class="info-item" v-model="promoter"></el-input>
                        <span class="tip text-tip">电话不对？ -->请到活动设置修改，或更换账号登陆</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="split-area">
                <div class="split-line"></div>
                <span class="split-title">手机扫一扫查看</span>
            </div>

        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'share-dialog',
    data() {
        return {
            promoter: ''
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        scene: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleCancel () {
            this.$emit('close');
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.share-dialog {
    .el-dialog__body {
        padding-top: 5px;
    }

    .share {
        border-top: 1px solid #aaa;

        .detail-title {
            position: relative;
            padding-top: 20px;

            .title-img {
                position: absolute;
                width: 120px;
                height: 120px;
                top: 20px;
                left: 0;
            }

            .tip {
                float: right;
            }
        }

        .split-area {
            position: relative;

            .split-line {
                position: absolute;
                z-index: 0;
                top: 0;
                left: 0;
                height: 0;
                width: 100%;
                margin: 10px;
                border-bottom: 1px solid rgba(#ccc, 0.6);
            }

            .split-title {
                position: absolute;
                left: 35%;
                z-index: 5;
                padding: 0 30px;
                background-color: #fff;
            }
        }

    }
}
</style>
