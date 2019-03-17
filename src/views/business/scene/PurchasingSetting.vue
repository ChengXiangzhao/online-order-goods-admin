<template>
    <div class="scene_purchasing_setting">
        <div class="steps" v-if="$route.query.type === 'scene-add'">
            <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
                <el-step v-for="step in steps" :title="step" :key="step"></el-step>
            </el-steps>
        </div>
        <div class="main">
            <Setting
               key="scene_purchasing_setting"
               :type="$route.query.type"
               :purchasing="null" 
               :scene="scene"
            ></Setting>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Setting from '../purchasing/Setting';

export default {
    name: 'scene-purchasing-setting',
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
        }),
        active: vm => vm.scene.length > 3 ? 3 : 1
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene_purchasing_setting {
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