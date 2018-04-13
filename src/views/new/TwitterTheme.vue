<style scoped>
.show{
    display: inherit;
}
.hidden {
    display: none;
}
.ivu-form-item {

}
.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
<template>
    <Form ref="newForm" :model="formData" :label-width="80"  :rules="ruleValidate" style="padding:20px;">
        <Form-item label="创建模式" prop="mode" style="margin-bottom:5px;">
            <Radio-group v-model="formData.mode">
                <Radio label="1">已有推文</Radio>
                <Radio label="2">新推文</Radio>
            </Radio-group>
        </Form-item>
        <FormItem label="推文地址"  prop="url" :class="formData.mode=='1' ? 'show': 'hidden'">
            <Input v-model="formData.url" placeholder="请输入twitter主题地址"></Input>
        </FormItem>
        <FormItem label="执行帐号" prop="account" :class="formData.mode=='1' ? 'hidden': 'show'">
            <Select v-model="formData.account">
                <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <Form-item label="正文内容" prop="content" :class="formData.mode=='1' ? 'hidden': 'show'">
            <Input v-model="formData.content" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <FormItem label="请选择附件" :class="formData.mode=='1' ? 'hidden': 'show'" style="margin-bottom:5px;">
            <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <icon type="ios-trash-outline" @click.native="handleRemove(item)"></icon>
                </div>
            </div>
            <upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :before-upload="handleBeforeUpload"
                type="drag"
                action=""
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <icon type="camera" size="20"></icon>
                </div>
            </upload>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('newForm')" :loading="submiting">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="windowClose">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                userList:[
                    {
                        label: '随机用户',
                        value: 0
                    }
                ],
                submiting:false,
                formData: {
                    mode: '1',
                    account: 0,
                    type:'1',
                    source:'1',
                    content: '',
                    url: ''
                },
                ruleValidate: {
                    mode: [
                        { required: true, message: '创建模式不能为空', trigger: 'change' }
                    ],
                    url: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    account: [
                        { type:'number', required: true, message: '用户不能为空', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '正文不能为空', trigger: 'blur' }
                    ]
                },
                uploadList: []
            }
        },
        mounted() {
            // 获取可用用户列表
            this.axios.get("/account/twitter/list.html").then((response)=>{
                for (let user of response.data.datas) {
                    var tmp = new Object()
                    if (user.is_auth == 1) {
                        tmp.label = user.nickname + '@' + user.name
                        tmp.value = user.id
                        this.userList.push(tmp)
                    }
                }
            });
            this.uploadList = this.$refs.upload.fileList;
        },
        methods : {
            windowClose () {
                window.close();
            },
            handleSubmit(name) {
                // 已有推文
                if(this.formData.mode == '1') {
                    this.$refs[name].validateField('url', (valid) => {
                        if (!valid) {
                            this.submiting = true
                            this.submit(this.formData)
                        } 
                        else 
                            this.$Message.error('表单验证失败!');
                        
                    });
                }
                // 新推文：1. 先创建一个推文任务；2. 再作为一个已有推文创建
                else {
                    this.$refs[name].validateField('account',(accountValid) => {
                        if(!accountValid)
                            this.$refs[name].validateField('content',(contentValid) => {
                            if(!contentValid) {
                                this.submiting = true;
                                let data = new FormData();
                                data.append('mode',this.formData.mode);
                                data.append('url',this.formData.url);
                                data.append('source',this.formData.source);
                                data.append('type',this.formData.type);
                                data.append('content', this.formData.content);
                                data.append('account', this.formData.account);
                                data.append('file', this.uploadList[0]);
                                this.axios.post("/task/create.html",data).then((response) => {
                                    if (response.data.result == 1) {
                                        this.submit({"url": response.data.status_url})
                                    }
                                    else
                                        this.$Notice.error({
                                            duration:2,
                                            title: response.data.msg
                                        });  
                                });
                            }
                            else 
                                this.$Message.error('表单验证失败!');
                        })
                    })
                }
            },
            submit(data) {
                debugger
                this.axios.post("/theme/twitter/save.html", data).then((response)=>{
                    this.submiting = false;
                    if(response.data.result == 1) {
                        window.close();
                    }                                      
                    else
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });      
                });
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            // 因为upload组件的上传事件默认是在选取文件后自动触发。
            // 因此要实现预览，就得修改为手动触发上传
            handleBeforeUpload (file) {
                // 判断文件类型是否是jpg/png/gif格式的图片
                if (!/^image/.test(file.type) || !/(png|jpg|jpeg)$/.test(file.name)) {
                    this.$Notice.warning({
                        title: '文件格式不正确',
                        desc: `文件 ${file.name} 格式不正确，请选择 jpg, jpeg, png 格式的图片`
                    })
                    return false
                }

                const check = this.uploadList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片'
                    });
                    return false
                }

                let reader = new FileReader()
                reader.readAsDataURL(file)
                const that = this
                reader.onload = function (e) {
                    file.url = reader.result
                    that.uploadList.push(file)
                }
                // 取消自动上传的触发，手动上传
                return false 
            }
        }
    }
</script>
