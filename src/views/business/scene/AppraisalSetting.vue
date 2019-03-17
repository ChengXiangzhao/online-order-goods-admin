<template>
    <div class="scene_appraisal_setting">
        <div class="steps" v-if="$route.query.type === 'scene-add'">
            <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
                <el-step v-for="step in steps" :title="step" :key="step"></el-step>
            </el-steps>
        </div>
        <div class="main">
            <Setting
               key="scene_appraisal_setting"
               :type="$route.query.type"
               :appraisal="null" 
               :scene="scene"
            ></Setting>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Setting from '../appraisal/Setting';

export default {
    name: 'scene-appraisal-setting',
    components: {
        Setting
    },
    data() {
        return {
            activeName: 'goods'
        }
    },
    computed: {
        ...mapState({
            steps: state => state.business.steps,
            scene: state => state.business.currScence
        })
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene_appraisal_setting {
    padding: 20px 0px;

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