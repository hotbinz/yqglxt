<style scoped>
.title {
    margin-bottom: 24px;
}
</style>

<template>
    <Form ref="newForm" :model="formData" :rules="ruleValidate" style="padding:20px;" label-position="top" >
        <Row :gutter="16" v-show="show">
            <Col span="12">
                <Form-item label="Youtube帐号" prop="name">
                    <Input v-model="formData.name" placeholder="请输入Youtube帐号"></Input>
                </Form-item>
            </Col>
            <Col span="12">
                <Form-item label="Youtube密码" prop="password">
                    <Input type="password" v-model="formData.password" placeholder="请输入Youtube密码"></Input>
                </Form-item>
            </Col>
        </Row>
        <Row :gutter="16" v-show="show">
            <Col span="24">
                <FormItem label="Client Secret" prop="client_secret">
                    <Input type="textarea" :rows="4" v-model="formData.client_secret" placeholder="请输入Client Secret"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="16" v-show="!show">
            <Col>
                 <h3 class="title">*请点击 <a :href="getAuthUrl()" target="_blank">此处</a> 对帐号进行授权认证，并记录授权code。</h3>
            </Col>
            <Col span="24">
                <FormItem label="授权code" prop="code">
                    <Input v-model="formData.code" placeholder="点击上方进行授权，然后填写授权code"></Input>
                </FormItem>
            </Col>
        </Row>
        <Form-item style="text-align:center;">
            <Button type="primary" @click="next('newForm')" v-show="show">下一步</Button>
            <Button type="ghost" @click="handleReset('newForm')" style="margin-left: 8px" v-show="show">重置</Button>
            <Button type="ghost" @click="prev()"  v-show="!show">上一步</Button>
            <Button type="primary" @click="handleSubmit('newForm')" :loading="submiting" style="margin-left: 8px" v-show="!show">提交</Button>
        </Form-item>
    </Form>
</template>
<script>
    export default {
        data () {
            const validateClientSecret = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('client_secret不能为空'));
                } else {
                    try {
                        let client_secret = JSON.parse(value)
                        this.client_id = client_secret.installed.client_id
                    } catch (error) {
                        
                    }
                    if (!this.client_id && this.client_id === '') {
                        callback(new Error('非法的Client Secret'));
                    }
                    else {
                        callback();
                    }
                }
            };
            return {
                show:true,
                submiting:false,
                formData: {
                    id: this.$store.state.user.id?this.$store.state.user.id:0,
                    name: this.$store.state.user.username,
                    password: this.$store.state.user.password,
                    client_secret: this.$store.state.app.user.youtube.client_secret,
                    code: this.$store.state.app.user.youtube.code,
                },
                client_id:"",
                ruleValidate: {
                    name: [
                        { required: true, message: 'Youtube帐号不能为空', trigger: 'blur' }
                    ],
                    client_secret: [
                        { required: true, validator: validateClientSecret, trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '授权code不能为空', trigger: 'blur' }
                    ]
                },
                ruleCustom: {
                    client_secret: [
                        { required: true, validator: validateClientSecret, trigger: 'blur' }
                    ]
                }
            }
        },
        methods : {
            windowClose () {
                window.close();
            },
            handleSubmit (name) {
                this.$refs[name].validateField('code',(codeValid) => {
                    if (!codeValid) {
                        this.submiting = true;
                        this.axios.post("/account/youtube/save.html", this.formData).then((response)=>{
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
            next (name) {
                 this.$refs[name].validateField('name',(nameValid) => {
                     if (!nameValid) {
                         this.$refs[name].validateField('client_secret',(secretValid) => {
                             if (!secretValid) {
                                 this.show = false
                             }
                         })
                     }
                     else {
                        this.$Message.error('表单验证失败!')
                    }
                 })
                
            },
            prev () {
                this.show = true
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            getAuthUrl () {
                return 'https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&client_id='+this.client_id+'&access_type=offline'
            }
        }
    }
</script>
