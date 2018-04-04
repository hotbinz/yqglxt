<style scoped>
.show{
    display: inherit;
}
.hidden {
    display: none;
}
.ivu-form-item {

}
</style>
<template>
    <Form ref="newForm" :model="formItem" :label-width="80"  :rules="ruleValidate" style="padding:20px;">
        <Form-item label="创建模式" style="margin-bottom:5px;">
            <Radio-group v-model="formItem.model">
                <Radio label="have">已有推文</Radio>
                <Radio label="new">新推文</Radio>
            </Radio-group>
        </Form-item>
        <FormItem label="推文地址"  prop="url" :class="formItem.model=='have' ? 'show': 'hidden'">
            <Input v-model="formItem.url" placeholder="请输入twitter主题地址"></Input>
        </FormItem>
        <FormItem label="执行帐号" prop="account" :class="formItem.model=='have' ? 'hidden': 'show'">
            <Select v-model="formItem.account">
                <Option v-for="item in userList" :value="item.value" :key="item.label">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <Form-item label="正文" prop="content" :class="formItem.model=='have' ? 'hidden': 'show'">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <FormItem label="请选择附件" :class="formItem.model=='have' ? 'hidden': 'show'" style="margin-bottom:5px;">
            <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :before-upload="handleBeforeUpload"
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
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
                userList:[{label:'随机用户',value:'0'}],
                submiting:false,
                defaultList:[],
                formItem: {
                    model:'have',
                    twitterUrl: ''
                },
                ruleValidate: {
                    url: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    account: [
                        { required: true, message: '用户不能为空', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '正文不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods : {
            windowClose () {
                window.close();
            },
            handleSubmit(name) {
                if(this.formItem.model == 'have') {
                    this.$refs[name].validateField('url',(valid) => {
                        if (!valid) {
                            this.submiting = true;
                            this.axios.post("/theme/twitter/save.html", this.formItem).then((response)=>{
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
                        }
                    });
                }
                else {
                    this.$refs[name].validateField('account', (accountValid)=>{
                        if(!accountValid)
                        this.$refs[name].validateField('content',(contentValid)=>{
                            if (!contentValid) {
                                this.$Notice.error({
                                        duration:2,
                                        title: 'response.data.msg'
                                    });   
                            }
                        })
                    });
                }
            },
            handleBeforeUpload (){

            }
        }
    }
</script>
