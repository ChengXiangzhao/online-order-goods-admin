<template>
    <el-dialog
        key="restart"
        title="重启活动"
        :visible="visible"
        @close="handleCancel"
        width="400px"
    >
        <div >
            <span><i class="el-icon-info"></i> {{title}}</span>
            <el-form v-if="isOverdue" label-width="120px" :model="resetTime" label-suffix=":" class="restart-time">
                <el-form-item label="开始时间" required>
                    <el-time-picker v-model="resetTime.start_at"></el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间" required>
                    <el-time-picker v-model="resetTime.end_at"></el-time-picker>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleYes">确 定</el-button>
            <el-button @click="handleCancel">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'restart-dialog',
    data() {
        return {
            resetTime: {
                start_at: '',
                end_at: ''
            }
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        isOverdue: {
            type: Boolean,
            required: true
        },
        sceneId: {
            type: Number,
            required: true
        }
    },
    computed: {
        title: function () {
            if (this.isOverdue) {
                return '活动时间已过期，请重新设置活动时间并提交重启';
            } else {
                return '确定重启该活动?';
            }
        }
    },
    methods: {
        handleYes () {
            // 重启活动

            this.$emit('yes');
        },
        handleCancel () {
            this.$emit('close');
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.restart-time {
    padding-top: 20px;
}
</style>
