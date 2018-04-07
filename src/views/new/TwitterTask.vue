<style scoped>
.show{
    display: inherit;
}
.hidden {
    display: none;
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
    <Form ref="newForm" :model="formItem" :label-width="100" :rules="ruleValidate" style="padding:20px;">
        <FormItem label="名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入任务名称"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入任务内容..."></Input>
        </FormItem>
        <FormItem label="请选择用户" prop="account">
            <Select v-model="formItem.account" filterable>
                <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="请选择附件" prop="file" :class="this.$route.query.type=='create' ? 'show': 'hidden'">
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
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                action=""
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <icon type="camera" size="20"></icon>
                </div>
            </upload>
        </FormItem>
        <FormItem label="推文地址"  prop="reply_url" :class="this.$route.query.type!='create' ? 'show': 'hidden'">
            <Input v-model="formItem.reply_url" placeholder="请输入twitter主题地址"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('newForm')" :loading="submiting">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="windowClose">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
    import { setTimeout } from 'timers';
    export default {
        data () {
            return {
                submiting:false,
                uploadList: [],
                imgName: '',
                visible: false,
                formItem: {
                    name: '',
                    content: '',
                    account: 0,
                    file: '',
                    reply_url: ''
                },
                ruleValidate: {
                    account: [
                        { type:'number', required: true, message: '用户不能为空', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '正文不能为空', trigger: 'blur' }
                    ],
                    reply_url: [
                        { required: this.$route.query.type!='create', message: '推文地址不能为空', trigger: 'blur' }
                    ]
                },
                userList: [{
                    "label" : "随机用户",
                    "value" : 0
                }],
                urls: {
                    "create": "/task/create_twitter.html",
                    "reply": "/task/reply_twitter.html",
                    "forward": "/task/forward_twitter.html"
                }
            }
        },
        mounted() {
            // 获取可用用户
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
        },
        methods : {
            windowClose () {
                window.close();
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submiting = true;
                        let type = this.$route.query.type
                        let data = new FormData();
                        data.append('name', this.formItem.name);
                        data.append('content', this.formItem.content);
                        data.append('account', this.formItem.account);
                        data.append('file', this.uploadList[0]);
                        data.append('reply_url', this.formItem.reply_url);
                        this.axios.post(this.urls[type], data).then((response)=>{
                            this.submiting = false;
                            if(response.data.result == 1) {
                                this.$Notice.success({
                                    duration:2,
                                    title: response.data.msg
                                });                                 
                                setTimeout(function(){
                                    window.close();
                                },1000)
                            }                                      
                            else
                                this.$Notice.error({
                                    duration:2,
                                    title: response.data.msg
                                });      
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
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
