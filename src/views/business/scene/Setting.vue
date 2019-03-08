<template>
    <div class="scene-setting">
        <div class="basic-info">
            <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-width="100px">
                <el-form-item label="活动标题"  prop="id">
                    <el-select class="info-item" v-model="form.id">
                        <el-option
                            v-for="item in sceneList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动推广人" prop="promoter" required>
                    <el-radio-group v-model="form.promoter">
                        <el-radio label="all">全员</el-radio>
                        <el-radio label="sale">销售</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联系电话" prop="phoneOwner" required>
                    <el-radio-group v-model="form.phoneOwner">
                        <el-radio label="promoter">推广人的</el-radio>
                        <el-radio label="sale">销售的</el-radio>
                        <el-radio label="default">默认联系人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="默认联系人" prop="contacts" required>
                    <el-input class="info-item" v-model="form.contacts"></el-input>
                </el-form-item>
                <el-form-item label="默认电话" prop="phoneNum" required>
                    <el-input class="info-item" v-model="form.phoneNum"></el-input>
                </el-form-item>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="打开位置限制">
                            <el-input class="info-item" v-model="form.location" prefix-icon="el-icon-location-outline" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="">
                            <el-switch v-model="form.is_location" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                </div>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="登陆IP限制">
                            <el-input class="info-item" v-model="form.ip" prefix-icon="el-icon-location-outline" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="">
                            <el-switch v-model="form.is_ip" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                </div>
                <div class="split-line"></div>
                <el-form-item>
                    <div class="btn-group">
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="desc-area">
            <div class="title">
                <span>现场活动未开始显示：</span>
            </div>
            <quill-editor v-model="beforeScene" :options="editorOption" class="quill-editor"></quill-editor>
            <div class="split-line"></div>
            <div class="btn-group">
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </div>
        </div>
        <div class="desc-area">
            <div class="title">
                <span>现场活动已结束显示：</span>
            </div>
            <quill-editor v-model="afterScene" :options="editorOption" class="quill-editor"></quill-editor>
            <div class="split-line"></div>
            <div class="btn-group">
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import cloneDeep from 'lodash/cloneDeep';
import { obj2FormData } from '@/utils/util';
import { updateScene } from '@/api/business';

export default {
    name: 'scene-setting',
    components: { quillEditor },
    data() {
        return {
            form: {
                id: '',
                promoter: 'all',
                phoneOwner: 'promoter',
                contacts: '',
                phoneNum: '',
                location: '',
                is_location: 1,
                ip: '',
                is_ip: 1
            },
            sceneList: [],
            beforeScene: '',
            afterScene: '',
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean']
                    ]
                },
                placeholder: '',
                readOnly: false
            }
        };
    },
    methods: {
        onSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let params = cloneDeep(this.form);
                    updateScene(obj2FormData(params), id).then((data) => {
                        if (data.status === 200) {
                            this.$notify({
                                title: '成功',
                                message: sucMsg,
                                type: 'success'
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: data.message
                            });
                        }
                    });
                }
            });
        }
    },
    created() {
        if (this.$route.query.id) {
            console.log(this.$route.query.id);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene-setting {
    padding: 20px;

    .basic-info {
        padding-bottom: 30px;

        .info-item {
            width: 350px;
        }

        .open-sign {
            display: flex;

            .is-open {
                display: inline-block;
            }
            .open-option {
                display: inline-block;
                .el-form-item__content {
                    margin-left: 20px !important;
                }
            }
        }
    }

    .desc-area {
        padding-bottom: 30px;

        .title {
            padding: 4px 2px;
            font-size: 12px;
        }

        .quill-editor {
            width: 80%;
        }
    }

    .split-line {
        height: 0;
        margin: 10px;
        border-bottom: 1px solid rgba(#ccc, 0.6);
    }

    .btn-group {
        float: right;
        padding-right: 100px;
    }
}
</style>
