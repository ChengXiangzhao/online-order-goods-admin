<template>
    <div class="scene-edit">
        <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
            <el-step v-for="step in steps" :title="step" :key="step"></el-step>
        </el-steps>

        <div class="basic-info">
            <div>
                <h3>基本信息</h3>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-width="150px">
                <el-form-item label="活动类型" prop="sort" required>
                    <el-radio-group v-model="form.sort" @change="handleSortChange">
                        <el-radio label="appraisal">评款会</el-radio>
                        <el-radio label="purchasing">订货会</el-radio>
                        <el-radio label="both">评款会+订货会</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动代码" prop="id" required>
                    <el-input class="info-item" v-model="form.id" placeholder="请输入3-9位数字或英文"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="name">
                    <el-input class="info-item" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="副标题(可选)">
                    <el-input class="info-item" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="主图">
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :on-success="(res, file) => handlePicSuccess(res, file, 'mainPicUrl')"
                        :before-upload="beforePicUpload"
                    >
                        <img v-if="mainPicUrl" :src="mainPicUrl" class="avatar" alt="点击替换图片">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="微信分享图(可选)">
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :on-success="(res, file) => handlePicSuccess(res, file, 'vicePicUrl')"
                        :before-upload="beforePicUpload"
                    >
                        <img v-if="vicePicUrl" :src="vicePicUrl" class="avatar" alt="点击替换图片">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动场馆" prop="stadium">
                    <el-input class="info-item" v-model="form.stadium" prefix-icon="el-icon-location-outline" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="场馆地址(可选)">
                    <el-input class="info-item" v-model="form.address" prefix-icon="el-icon-location-outline" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="活动日期" prop="startDate">
                    <el-date-picker
                        class="info-item"
                        v-model="form.startDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <div class="open-sign">
                    <div class="is-open">
                        <el-form-item label="是否开放报名">
                            <el-switch v-model="form.is_signup"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="open-option" v-if="form.is_signup">
                        <el-form-item label="">
                            <el-checkbox-group v-model="form.openType">
                                <el-checkbox label="date" name="date">日期</el-checkbox>
                                <el-checkbox label="name" name="name">姓名</el-checkbox>
                                <el-checkbox label="phone" name="phone">电话</el-checkbox>
                                <el-checkbox label="num" name="num">人数</el-checkbox>
                                <el-checkbox label="cert" name="cert">身份证号</el-checkbox>
                                <el-checkbox label="diect" name="diect">所在区域</el-checkbox>
                                <el-checkbox label="along" name="along">添加随行人员</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="参会人员类型"  prop="signup_sort" v-if="!form.is_signup">
                    <el-select class="info-item" v-model="form.signup_sort" multiple placeholder="请选择">
                        <el-option
                            v-for="item in peopleTypeList"
                            :key="item.value"
                            :value="item.value"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加参会人员"  prop="signup_person" v-if="!form.is_signup">
                    <el-select class="info-item" v-model="form.signup_person" multiple placeholder="请选择">
                        <el-option
                            v-for="item in peopleList"
                            :key="item.value"
                            :value="item.value"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报名日期" prop="signDate">
                    <el-date-picker
                        v-model="form.signDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="详情描述(可选)">
                    <quill-editor v-model="form.description" :options="editorOption" class="quill-editor"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <div class="btn-group">
                        <el-button>预览</el-button>
                        <el-button>保存并进行下一步</el-button>
                        <el-button type="primary" @click="onSubmit">确定发布</el-button>
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
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { obj2FormData } from '@/utils/util';
import { addScene } from '@/api/business';

export default {
    name: 'add-scene',
    components: { quillEditor },
    data() {
        let checkId = (rule, value, callback) => {
            let regId = /[0-9a-zA-Z]+/g;
            if (!value) {
                return callback(new Error('请输入活动id'));
            }
            if (value.length < 4 || value.length > 9) {
                return callback(new Error('长度必须在4到9之间'));
            }
            if (!regId.test(value)) {
                callback(new Error('id必须是数字或者英文字母'));
            } else {
                callback();
            }
        };
        return {
            form: {
                sort: 'appraisal',
                id: '',
                supplier_id: 547,
                website_id: 4,
                name: '',
                title: '',
                mainPic: '',
                vicePic: '',
                stadium: '',
                address: '',
                startDate: '',
                is_signup: true,
                signDate: '',
                openType: [],
                signup_sort: [],
                signup_person: [],
                description: ''
            },
            mainPicUrl: '',
            vicePicUrl: '',
            rules: {
                id: [
                    { validator: checkId, trigger: 'blur' }
                ],
                name: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
                stadium: [{ required: true, message: '请输入场馆名称', trigger: 'blur' }],
                startDate: [{ required: true, message: '请输入活动日期', trigger: 'blur' }],
                signDate: [{ required: true, message: '请输入报名日期', trigger: 'blur' }],
                signup_sort: [{ required: true, message: '请选择参会人员类型', trigger: 'blur' }],
                signup_person: [{ required: true, message: '请选择参会人员', trigger: 'blur' }]
            },
            peopleTypeList: [
                {
                    name: '员工',
                    value: 'employee'
                },
                {
                    name: '客户',
                    value: 'client'
                },
                {
                    name: '访客',
                    value: 'visitor'
                }
            ],
            peopleList: [],
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
            },
            steps: ['基本信息', '管理评款商品']
        };
    },
    methods: {
        onSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 判断主图是否存在

                    let params = cloneDeep(this.form);
                    // 格式化活动时间和报名时间
                    params.start_at = moment(params.startDate[0]).format('YYYY-MM-DD HH:mm:ss');
                    params.end_at = moment(params.startDate[1]).format('YYYY-MM-DD HH:mm:ss');
                    params.signup_start = moment(params.signDate[0]).format('YYYY-MM-DD HH:mm:ss');
                    params.signup_end = moment(params.signDate[1]).format('YYYY-MM-DD HH:mm:ss');
                    delete params.startDate;
                    delete params.signDate;

                    params.status = '1';
                    addScene(obj2FormData(params)).then((data) => {
                        console.log(data);
                    });
                }
            });
        },
        handleMainPicChange(file, fileList) {
            this.form.mainPic = fileList;
        },
        handleVicePicChange(file, fileList) {
            this.form.vicePic = fileList;
        },
        handlePicSuccess(res, file, picName) {
            console.log(res);
            this[picName] = URL.createObjectURL(file.raw);
        },
        beforePicUpload(file) {
            const ispic = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!ispic) {
               this.$message.error('请上传 JPG  或 PNG 格式图片!'); 
            }
            return ispic;
        },
        handleSortChange (val) {
            if (val === 'appraisal') {
                this.steps = ['基本信息', '管理评款商品'];
            } else if (val === 'purchasing') {
                this.steps = ['基本信息', '管理订货商品'];
            } else if (val === 'both') {
                this.steps = ['基本信息', '管理评款商品', '管理订货商品'];
            }
        },
        handleSwitchChange (val) {
            if (val) {
                console.log(val);
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.scene-edit {
    padding: 20px 80px;

    .basic-info {
        margin-top: 40px;

        h3 {
            font-size: 16px;
        }

        .info-item {
            width: 350px;
        }

        // .el-upload--picture-card {
        //     width: 100px;
        //     height: 100px;
        //     line-height: 100px;
        // }
        // .el-upload-list__item {
        //     width: 100px;
        //     height: 100px;
        //     line-height: 100px;
        // }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
        }
        .avatar {
            width: 100px;
            height: 100px;
            display: block;
        }

        .open-sign {
            display: flex;

            .is-open {
                display: inline-block;
            }
            .open-option {
                display: inline-block;
                .el-form-item__content {
                    margin-left: 30px !important;
                }
            }
        }

        .quill-editor {
            width: 70%;
        }

        .btn-group {
            float: right;
            padding-right: 30%;
        }
    }

}
</style>
