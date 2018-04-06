<style scoped>
.show{
    display: inherit;
}
.hidden {
    display: none;
}
</style><template>
    <Form ref="newForm" :model="formData" :label-width="100" :rules="ruleValidate" style="padding:20px;">
        <FormItem label="任务名称" prop="name">
            <Input v-model="formData.name" placeholder="请输入任务名称"></Input>
        </FormItem>
        <FormItem label="请选择用户" prop="account">
            <Select v-model="formData.account" filterable>
                <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="视频地址" prop="reply_url">
            <Input v-model="formData.reply_url" placeholder="请输入YouTube视频地址"></Input>
        </FormItem>
        <FormItem label="操作方式" prop="rate" :class="this.$route.query.type=='vote' ? 'show': 'hidden'">
            <RadioGroup v-model="formData.rate">
                <Radio label="1">
                    <span>赞</span>
                </Radio>
                <Radio label="2">
                    <span>踩</span>
                </Radio>
                <Radio label="0">
                    <span>无</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="内容" prop="content" :class="this.$route.query.type=='reply' ? 'show': 'hidden'">
            <Input v-model="formData.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入任务内容..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('newForm')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="windowClose">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                formData: {
                    name: '',
                    account: '0',
                    reply_url: '',
                    rate: "1",
                    content: ''
                },
                ruleValidate: {
                    account: [
                        { required: true, message: '用户不能为空', trigger: 'change' }
                    ],
                    content: [
                        { required: this.$route.query.type=='reply', message: '正文不能为空', trigger: 'blur' }
                    ],
                    reply_url: [
                        { required: true, message: '推文地址不能为空', trigger: 'blur' }
                    ],
                    rate: [
                        { required: this.$route.query.type=='vote', message: '操作不能为空', trigger: 'change' }
                    ],
                },
                userList: [
                    {
                        value: '0',
                        label: '随机用户'
                    },
                ],
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
                        if (type == 'vote') {
                            url = "/task/vote_youtube.html"
                        }
                        else {
                            url = "task/reply_youtube.html"
                        }
                        this.axios.post(url, this.formData).then((response)=>{
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
            }
        }
    }
</script>
