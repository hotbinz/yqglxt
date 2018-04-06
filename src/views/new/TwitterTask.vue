<style scoped>
.show{
    display: inherit;
}
.hidden {
    display: none;
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
            <Upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
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
                    account: '0',
                    file: '',
                    reply_url: ''
                },
                ruleValidate: {
                    account: [
                        { required: true, message: '用户不能为空', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '正文不能为空', trigger: 'blur' }
                    ],
                    reply_url: [
                        { required: this.$route.query.type!='create', message: '推文地址不能为空', trigger: 'blur' }
                    ]
                },
                TaskUser:0,
                userList: [{
                    "label" : "随机用户",
                     "value" : "0"
                }],
                model: '0'
            }
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
                        let url;
                        if (type == 'create') {
                            url = "/task/ceate_twitter.html"
                        }
                        else if (type == 'reply') {
                            url = "/task/reply_twitter.html"
                        }
                        else {
                            url = "/task/forward_twitter.html"
                        }
                        this.axios.post(url, this.formItem, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then((response)=>{
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
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
        },
        computed: {
            getUserList() {
                this.axios.get("/account/twitter/list.html").then((response)=>{
                    var userList = new Array()
                    var defaultUser = {
                        "label" : "随机用户",
                        "value" : "0"
                    }
                    userList.push(defaultUser)
                    for (let user of response.data.datas) {
                        var tmp = new Object()
                        if (user.is_auth == 1) {
                            tmp.label = user.nickname + '@' + user.name
                            tmp.value = user.id
                            userList.push(tmp)
                        }
                    }
                    return userList
                });
            }
        }
    }
</script>
