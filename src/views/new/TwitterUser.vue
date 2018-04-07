<template>
    <Form ref="newForm" :model="formData" :rules="ruleValidate" style="padding:20px;" label-position="top" >
        <Row :gutter="16">
            <Col span="12">
                <Form-item label="姓名" prop="name">
                    <Input v-model="formData.name" placeholder="请输入用户名"></Input>
                </Form-item>
            </Col>
            <Col span="12">
                <Form-item label="密码" prop="password">
                    <Input type="password" v-model="formData.password" placeholder="请输入密码"></Input>
                </Form-item>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col span="12">
                <FormItem label="consumer_key" prop="consumer_key">
                    <Input v-model="formData.consumer_key" placeholder="请输入consumer_key"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="consumer_secret" prop="consumer_secret">
                    <Input v-model="formData.consumer_secret" placeholder="请输入consumer_secret"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col span="12">
                <FormItem label="access_token" prop="access_token">
                    <Input v-model="formData.access_token" placeholder="请输入access_token"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="access_token_secret" prop="access_token_secret">
                    <Input v-model="formData.access_token_secret" placeholder="请输入access_token_secret"></Input>
                </FormItem>
            </Col>
        </Row>
        <Form-item style="text-align:center;">
            <Button type="primary" @click="handleSubmit('newForm')" :loading="submiting">提交</Button>
            <Button type="ghost" @click="handleReset('newForm')" style="margin-left: 8px">重置</Button>
        </Form-item>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                submiting:false,
                formData: {
                    name: '',
                    password: '',
                    consumer_key: this.$store.state.app.user.twitter.consumer_key,
                    consumer_secret: this.$store.state.app.user.twitter.consumer_secret,
                    access_token: this.$store.state.app.user.twitter.access_token,
                    access_token_secret: this.$store.state.app.user.twitter.access_token_secret
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    consumer_key: [
                        { required: true, message: 'consumer_key不能为空', trigger: 'blur' }
                    ],
                    consumer_secret: [
                        { required: true, message: 'consumer_secret不能为空', trigger: 'blur' }
                    ],
                    access_token: [
                        { required: true, message: 'access_token不能为空', trigger: 'blur' }
                    ],
                    access_token_secret: [
                        { required: true, message: 'access_token_secret不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submiting = true;
                        this.$store.commit('setUserSetting', {
                                consumer_key : this.formData.consumer_key,
                                consumer_secret : this.formData.consumer_secret,
                                access_token : this.formData.access_token,
                                access_token_secret : this.formData.access_token_secret
                            }   
                        );
                        this.axios.post("/account/twitter/save.html", this.formData).then((response)=>{
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
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>