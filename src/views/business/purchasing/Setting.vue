<template>
    <div class="purchasing-setting">
        <div class="basic-info">
            <el-form ref="form" :model="form" label-suffix=":" label-width="170px">
                <el-form-item label="订货会标题"  prop="name" required>
                    <el-input class="info-item" v-model="form.name"></el-input>
                </el-form-item>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="是否允许超卖">
                            <el-switch v-model="form.is_oversold" :active-value="2" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="显示商品图片">
                            <el-switch v-model="form.show_pic" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                </div>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="最小订货金额">
                            <el-input  v-model="form.min_money"></el-input>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="最小订货数量(订单)">
                            <el-input  v-model="form.min_number" placeholder="0为不限制"></el-input>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="最小订货数量(每款数)">
                            <el-input v-model="form.min_number_goods" placeholder="0为不限制"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="订货日期" prop="range"  required>
                    <el-date-picker
                        class="info-item"
                        v-model="form.range"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <div class="desc-area">
                    <div class="title">
                        <span>评订货描述：</span>
                    </div>
                    <quill-editor
                        :style="styleSet" 
                        :disabled="false"
                        v-model="form.description"
                        ref="myQuillEditor"
                        options="editorOption">
                        <div v-html="form.description"></div>
                    </quill-editor>
                </div>
                <el-form-item>
                    <div class="btn-group">
                        <!-- <el-button :v-show="false">预览</el-button> -->
                        <el-button @click="cancel">取消</el-button>
                        <el-button v-if="type === 'scene-add'" type="primary" @click="next">保存并进行下一步</el-button>
                        <el-button type="primary" @click="release">确定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { obj2FormData } from '@/utils/util';
import { purchasingAdd } from '@/api/business';

export default {
    name: 'purchasing-setting',
    components: { quillEditor },
    data() {
        return {
            form: {
                id: 0,
                scene_id: 0,
                name: '',
                range: [],
                is_oversold: 2,
                show_pic: 1,
                min_money: 1,
                min_number: '',
                min_number_goods: '',
                description: ''
            },
            purchasingList: [],
            styleSet: '',
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
                placeholder: '请输入······',
                readOnly: false
            },
        };
    },
    props: {
        purchasing: {
            type: Object,
            required: true
        },
        scene: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: 'add',
            required: false
        }
    },
    methods: {
        onSubmit () {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = cloneDeep(this.form);
                        params.purchasing_range = `${moment(params.range[0]).format('YYYY-MM-DD HH:mm')}==${moment(params.range[1]).format('YYYY-MM-DD HH:mm')}`;
                        delete params.range;
                        params.scene_id = this.scene.id;
                        purchasingAdd(obj2FormData(params), this.scene.id).then((data) => {
                            if (data.status === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '设置完成',
                                    type: 'success'
                                });
                                this.$emit('close', false);
                                resolve();
                            } else {
                                this.$notify.error({
                                    title: '错误',
                                    message: data.message
                                });
                                reject();
                            }
                        });
                    } else {
                        reject();
                    }
                });
            });
        },
        next () {
            this.onSubmit().then(() => {
                this.$router.push('/business/purchasing-goods?type=scene_add')
            });
        },
        cancel() {
            this.$router.back();
        },
        release() {
            this.onSubmit().then(() => {
                this.cancel();
            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.purchasing-setting {
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
                margin-left: 40px;
            }
        }

        .el-rate__icon {
            margin-top: 6px;
        }
    }

    .desc-area {
        padding-bottom: 30px;

        .title {
            padding: 4px 2px;
            color: #606266;
            font-size: 14px;
            font-weight: 600;
        }

        .quill-editor {
            width: 80%;
        }
    }

    .btn-group {
        float: right;
        padding-right: 25%;
    }
}
</style>
