<template>
    <div class="scene-edit">
        <el-steps v-if="type === 'add'" :active="0" finish-status="success" style="margin-top: 20px">
            <el-step v-for="step in steps" :title="step" :key="step"></el-step>
        </el-steps>

        <div class="basic-info">
            <div>
                <h3>基本信息</h3>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-width="150px">
                <el-form-item label="活动类型" prop="sort" required>
                    <el-radio-group v-model="form.sort" :disabled="type !== 'add'" @change="handleSortChange">
                        <el-radio label="appraisal">评款会</el-radio>
                        <el-radio label="purchasing">订货会</el-radio>
                        <el-radio label="both">评款会+订货会</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动代码" prop="code" required>
                    <el-input class="info-item" v-model="form.code" placeholder="请输入3-9位数字或英文"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="name">
                    <el-input class="info-item" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="副标题(可选)">
                    <el-input class="info-item" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="主图" prop="picture">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/upload/base/scene/picture.html"
                        :data="uploadData"
                        name="Attachment[files][picture]"
                        :show-file-list="false"
                        :on-success="(res, file) => handlePicSuccess(res, file, 'picture')"
                        :before-upload="beforePicUpload"
                    >
                        <img v-if="picture" :src="picture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="微信分享图(可选)">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/upload/base/scene/picture_wechat.html"
                        :data="uploadData"
                        name="Attachment[files][picture_wechat]"
                        :show-file-list="false"
                        :on-success="(res, file) => handlePicSuccess(res, file, 'picture_wechat')"
                        :before-upload="beforePicUpload"
                    >
                        <img v-if="picture_wechat" :src="picture_wechat" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
                            <el-switch v-model="form.is_signup" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="open-option" v-if="form.is_signup === 1">
                        <el-form-item label="">
                            <el-checkbox-group v-model="form.openType">
                                <el-checkbox label="date" name="date">日期</el-checkbox>
                                <el-checkbox label="name" name="name">姓名</el-checkbox>
                                <el-checkbox label="mobile" name="mobile">电话</el-checkbox>
                                <el-checkbox label="follownum" name="follownum">人数</el-checkbox>
                                <el-checkbox label="idcard" name="idcard">身份证号</el-checkbox>
                                <el-checkbox label="area" name="area">所在区域</el-checkbox>
                                <el-checkbox label="follow" name="follow">添加随行人员</el-checkbox>
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
                <el-form-item label="添加参会人员"  prop="signupPerson" v-if="!form.is_signup">
                    <el-select class="info-item" v-model="form.signupPerson" multiple placeholder="请选择">
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
                        <!-- <el-button :v-show="false">预览</el-button> -->
                        <el-button @click="cancel">取消</el-button>
                        <el-button v-if="type === 'add'" @click="next">保存并进行下一步</el-button>
                        <el-button type="primary" @click="release">{{type === 'edit' ? '保存修改' : '确定发布'}}</el-button>
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
import { mapState, mapMutations } from 'vuex';
import { obj2FormData } from '@/utils/util';
import { addScene, sceneDetail, updateScene, teamworkList } from '@/api/business';

export default {
    name: 'add-scene',
    components: { quillEditor },
    data() {
        let _self = this;

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
        let picCheck = (rule, value, callback) => {
            if (_self.form.picture === '') {
                return callback(new Error('请上传主图'));
            } else {
                callback();
            }
        };

        return {
            type: 'add',
            form: {
                sort: 'appraisal',
                code: '',
                supplier_id: 547,
                website_id: 4,
                name: '',
                title: '',
                picture: '',
                picture_wechat: '',
                stadium: '',
                address: '',
                startDate: '',
                is_signup: true,
                signDate: '',
                openType: [],
                signup_sort: [],
                signupPerson: [],
                description: ''
            },
            picture: '',
            picture_wechat: '',
            uploadData: {
                id: '',
                mparam: ''
            },
            rules: {
                code: [{ validator: checkId, trigger: 'blur' }],
                name: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
                stadium: [{ required: true, message: '请输入场馆名称', trigger: 'blur' }],
                startDate: [{ required: true, message: '请输入活动日期', trigger: 'blur' }],
                signDate: [{ required: true, message: '请输入报名日期', trigger: 'blur' }],
                signup_sort: [{ required: true, message: '请选择参会人员类型', trigger: 'blur' }],
                signupPerson: [{ required: false, message: '请选择参会人员', trigger: 'blur' }],
                picture: [{ validator: picCheck, trigger: 'blur' }]
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
            peopleList: {},
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
    computed: {
        ...mapState({
            steps: state => state.business.steps
        })
    },
    methods: {
        onSubmit () {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = cloneDeep(this.form);
                        // 格式化活动时间和报名时间
                        params.start_at = moment(params.startDate[0]).format('YYYY-MM-DD HH:mm:ss');
                        params.end_at = moment(params.startDate[1]).format('YYYY-MM-DD HH:mm:ss');
                        params.signup_start = moment(params.signDate[0]).format('YYYY-MM-DD HH:mm:ss');
                        params.signup_end = moment(params.signDate[1]).format('YYYY-MM-DD HH:mm:ss');
                        params.scene_invited = params.signupPerson;

                        delete params.startDate;
                        delete params.signDate;
                        delete params.signupPerson;

                        if (!params.status) {
                            params.status = '1';
                        }
                        
                        let id = null;
                        let fun = addScene;
                        let sucMsg = '添加活动成功';
                        if (this.type === 'edit') {
                            id = params.id;
                            delete params.id
                            fun = updateScene;
                            sucMsg = '修改活动成功';
                        }

                        fun(obj2FormData(params), id).then((data) => {
                            if (data.status === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: sucMsg,
                                    type: 'success'
                                });
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
        cancel() {
            this.$router.back();
        },
        release() {
            this.onSubmit().then(() => {
                this.cancel();
            });
        },
        next () {
            this.onSubmit().then(() => {
                this.$router.push('/business/appraisal-setting?type=scene-add');
            });
        },
        handlePicSuccess(res, file, picName) {
            this.form[picName] = res.files[0]['id'];
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
            let steps = null;
            if (val === 'appraisal') {
                steps = ['基本信息', '评款设置', '管理评款商品'];
            } else if (val === 'purchasing') {
                steps = ['基本信息',  '订货设置', '管理订货商品'];
            } else if (val === 'both') {
                steps = ['基本信息', '评款设置', '管理评款商品', '订货设置', '管理订货商品'];
            }
            this.SET_STEPS(steps);
        },
        getTeamworkDict() {
            teamworkList({point_format_list: 'cascade', field_key: 'user_id'}).then(res => {
                this.peopleList = Object.keys(res.datas).map(item => {
                    return {
                        value: item,
                        name: res.datas[item]
                    };
                });
            });
        },
        ...mapMutations([
            'SET_STEPS',
            'SET_SCENCE'
        ])
    },
    created() {
        this.getTeamworkDict();
        if (this.$route.query.id) {
            this.type = 'edit';
            sceneDetail(this.$route.query.id).then(res => {
                if (res.status === 200) {
                    let rawScene = res.datas.info.base;
                    rawScene.startDate = [moment.unix(rawScene.start_at), moment.unix(rawScene.start_end || rawScene.end_at)];
                    rawScene.signDate = [moment.unix(rawScene.signup_start), moment.unix(rawScene.signup_end)];
                    if (!rawScene.signup_sort || rawScene.signup_sort === '') {
                        rawScene.signup_sort = [];
                    } else {
                        rawScene.signup_sort = rawScene.signup_sort.split(',');
                    }
                    if (!rawScene.signupPerson || rawScene.signupPerson === '') {
                        rawScene.signupPerson = [];
                    } else {
                        rawScene.signupPerson = rawScene.signupPerson.split(',');
                    }
                    this.form = rawScene;
                }
            });
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
