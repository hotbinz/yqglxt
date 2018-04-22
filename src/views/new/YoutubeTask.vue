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
                <Radio label='1'>
                    <span>赞</span>
                </Radio>
                <Radio label='2'>
                    <span>踩</span>
                </Radio>
                <Radio label='0'>
                    <span>无</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="正文内容" prop="content" :class="this.$route.query.type=='reply' ? 'show': 'hidden'">
            <Input v-model="formData.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入正文内容..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('newForm')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="windowClose">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
    import { setTimeout } from 'timers';
    export default {
        data () {
            return {
                formData: {
                    name: '',
                    account: 0,
                    reply_url: '',
                    rate: '1',
                    content: '',
                    source: '2',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '任务名称不能为空', trigger: 'blur' }
                    ],
                    account: [
                        { type:'number', required: true, message: '用户不能为空', trigger: 'change' }
                    ],
                    content: [
                        { required: this.$route.query.type=='reply', message: '正文内容不能为空', trigger: 'blur' }
                    ],
                    reply_url: [
                        { required: true, message: '视频地址不能为空', trigger: 'blur' }
                    ],
                    rate: [
                        { required: this.$route.query.type=='vote', message: '操作不能为空', trigger: 'change' }
                    ],
                },
                userList: [
                    {
                        value: 0,
                        label: '随机用户'
                    },
                ],
                urls: {
                    "vote": "/task/create.html",
                    "reply": "task/create.html",
                }
            }
        },
        mounted() {
            // 获取可用用户
            this.axios.get("/account/youtube/list.html").then((response)=>{
                for (let user of response.data.datas) {
                    if (user.is_auth == 1) {
                        this.userList.push({
                            label:user.name,
                            value:user.id,
                        })
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
                        var params = new URLSearchParams();
                        params.append('source', this.formData.source)
                        params.append('name', this.formData.name)
                        
                        params.append('account', this.formData.account)
                        params.append('reply_url', this.formData.reply_url)
                        params.append('content', this.formData.content)
                        params.append('rate', this.formData.rate)
                        if (type == 'vote') {
                            params.append('type', '5')
                        }
                        else 
                            params.append('type', '2')

                        this.axios.post(this.urls[type], params).then((response)=>{
                            let tmp1 = response.data.split("var data = ")
                            let tmp2 = tmp1[1].split(";")
                            let tmp3 = JSON.parse(tmp2[0].replace(/'/g, '"'))
                            
                            this.submiting = false;
                            if(tmp3.result == 1) {
                                this.$Notice.success({
                                    duration:2,
                                    title: tmp3.msg
                                }); 
                            }                                      
                            else
                                this.$Notice.error({
                                    duration:2,
                                    title: tmp3.msg
                                });    
                            setTimeout(function(){
                                window.close();
                            },1000)  
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        }
    }
</script>
