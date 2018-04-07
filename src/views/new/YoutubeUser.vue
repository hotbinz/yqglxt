<template>
    <Form ref="newForm" :model="formData" :rules="ruleValidate" style="padding:20px;" label-position="top" >
        <Row :gutter="16">
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
        <Row :gutter="16">
            <Col span="12">
                <FormItem label="client_secret" prop="client_secret">
                    <Input v-model="formData.client_secret" placeholder="请输入client_secret"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="授权code" prop="code">
                    <Input v-model="formData.code" placeholder="请输入授权code"></Input>
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
                    id: 0,
                    name: '',
                    password: '',
                    client_secret: '',
                    code: '',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'Youtube帐号不能为空', trigger: 'blur' }
                    ],
                    client_secret: [
                        { required: true, message: 'client_secret不能为空', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '授权code不能为空', trigger: 'blur' }
                    ]
                }
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
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
