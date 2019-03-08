<template>
    <div class="appraisal-setting">
        <div class="basic-info">
            <el-form ref="form" :model="form" label-suffix=":" label-width="100px">
                <el-form-item label="评款会名称"  prop="name" required>
                    <el-input class="info-item" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="评款日期" prop="range"  required>
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
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="评款星数">
                            <el-rate
                                v-model="form.star"
                            ></el-rate>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="允许半颗星">
                            <el-switch v-model="form.star_half" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="开启文字提示">
                            <el-switch v-model="form.is_hint" :active-value="1" :inactive-value="0"></el-switch>
                            <span class="text-tip">(差、一般、挺好、满意、很好)</span>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="开启收藏">
                    <el-switch v-model="form.is_favour" :active-value="1" :inactive-value="0"></el-switch>
                    <span class="text-tip">(评款结束之后仍然可以查看所收藏的商品信息)</span>
                </el-form-item>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="推荐到订货会">
                            <el-switch v-model="form.is_recommend" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="open-option">
                        <el-form-item label="每个账户推荐数限额">
                            <el-input v-model="form.num_recommend"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="评款项">
                    <el-radio-group v-model="form.elem_sort" @change="handleSortChange">
                        <el-radio label="default">默认</el-radio>
                        <el-radio label="self">自定义(至少选择一项)</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" v-if="form.elem_sort === 'self'">
                    <el-checkbox-group v-model="form.elem_list">
                        <el-checkbox label="date" name="date">款式</el-checkbox>
                        <el-checkbox label="name" name="name">时尚</el-checkbox>
                        <el-checkbox label="color" name="color">配色</el-checkbox>
                        <el-checkbox label="num" name="num">工艺</el-checkbox>
                        <el-checkbox label="cert" name="cert">配件</el-checkbox>
                        <el-checkbox label="diect" name="diect">价格</el-checkbox>
                        <el-checkbox label="along" name="along">综合</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div class="desc-area">
                    <div class="title">
                        <span>评款会帮助提示：</span>
                    </div>
                    <quill-editor
                        :style="styleSet" 
                        :disabled="false"
                        v-model="form.content"
                        ref="myQuillEditor"
                        options="editorOption">
                        <div v-html="form.content"></div>
                    </quill-editor>
                </div>
                <el-form-item>
                    <div class="btn-group">
                        <el-button>预览</el-button>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
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
import { appraisalSet } from '@/api/business';

export default {
    name: 'scene-setting',
    components: { quillEditor },
    data() {
        return {
            form: {
                id: 0,
                scene_id: 0,
                name: '',
                range: [],
                star: 5,
                star_half: 1,
                is_hint: 1,
                is_favour: 1,
                is_recommend: 1,
                num_recommend: 0,
                elem_sort: 'self',
                elem_list: ['color'],
                content: ''
            },
            appraisalList: [],
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
        appraisal: {
            type: Object,
            required: true
        }
    },
    methods: {
        onSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let params = cloneDeep(this.form);
                    params.appraisal_range = `${moment(params.range[0]).format('YYYY-MM-DD HH:mm')}==${moment(params.range[1]).format('YYYY-MM-DD HH:mm')}`;
                    delete params.range;
                    appraisalSet(obj2FormData(params), this.form.scene_id).then((data) => {
                        if (data.status === 200) {
                            this.$notify({
                                title: '成功',
                                message: '设置完成',
                                type: 'success'
                            });
                            this.$emit('close', false);
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
        // if (this.appraisal.id) {
        //     this.form = cloneDeep(this.appraisal);
        // } else {
        //     this.form.scene_id = this.appraisal.scene_id;
        // }
        this.form.scene_id = this.appraisal.scene_id;
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.appraisal-setting {
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
